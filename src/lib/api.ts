export async function fetchFromGoogleSheet(action: string) {
  const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxDcwhhASlDKV94UVfGghm3hp6JLTfB6LIhmoceg8KcfFehn-AJXb6nydrrGpyiIEtS/exec'
  const apiKey = process.env.MEDAI_MATE_API_KEY || 'medaimate-secret-api-key-2026'
  
  if (!url || !apiKey) {
    throw new Error('Missing Apps Script URL or API Key')
  }

  // Construct URL with query parameters
  const requestUrl = new URL(url)
  requestUrl.searchParams.append('api', 'true')
  requestUrl.searchParams.append('action', action)
  requestUrl.searchParams.append('apiKey', apiKey)

  try {
    const response = await fetch(requestUrl.toString(), {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const text = await response.text()
    try {
      const data = JSON.parse(text)
      if (!data.success) {
        throw new Error(data.error || 'API response reported failure')
      }
      return data.data
    } catch (parseError) {
      console.error(`Failed to parse JSON. Raw response from Google: ${text.substring(0, 200)}...`)
      throw new Error('Received HTML instead of JSON. Web App may not be deployed with "Who has access: Anyone".')
    }
  } catch (error) {
    console.error(`Error fetching action ${action}:`, error)
    return null
  }
}

export async function getPlanningData() {
  return fetchFromGoogleSheet('getPlanningData')
}

export async function getVideoData() {
  return fetchFromGoogleSheet('getVideoData')
}

export async function getDashboardExtraData() {
  return fetchFromGoogleSheet('getDashboardExtraData')
}

/**
 * Creates a new story by sending a POST request to Google Apps Script.
 */
export async function createPlanningStory(storyData: any) {
  const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxDcwhhASlDKV94UVfGghm3hp6JLTfB6LIhmoceg8KcfFehn-AJXb6nydrrGpyiIEtS/exec'
  const apiKey = process.env.MEDAI_MATE_API_KEY || 'medaimate-secret-api-key-2026'
  
  if (!url || !apiKey) {
    throw new Error('Google Script URL or API Key is missing in environment variables')
  }

  const requestUrl = new URL(url)
  requestUrl.searchParams.append('api', 'true')
  requestUrl.searchParams.append('action', 'createStory')
  requestUrl.searchParams.append('apiKey', apiKey)

  try {
    const response = await fetch(requestUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storyData),
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const text = await response.text()
    try {
      const data = JSON.parse(text)
      if (!data.success) {
        throw new Error(data.error || 'API response reported failure')
      }
      return data.data
    } catch (parseError) {
      console.error(`Failed to parse JSON. Raw response from Google: ${text.substring(0, 200)}...`)
      throw new Error('Received HTML instead of JSON. Check Apps Script deployment permissions.')
    }
  } catch (error) {
    console.error(`Error creating story:`, error)
    throw error
  }
}
