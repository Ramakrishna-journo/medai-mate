const url = 'https://script.google.com/macros/s/AKfycbxDcwhhASlDKV94UVfGghm3hp6JLTfB6LIhmoceg8KcfFehn-AJXb6nydrrGpyiIEtS/exec?api=true&action=createStory&apiKey=medaimate-secret-api-key-2026';

const data = {
  title: "AI in Newsrooms 2026",
  reporterName: "Agent Test",
  reporterEmail: "agent@test.com",
  region: "Global",
  format: "Text",
  type: "Feature",
  genre: "Technology",
  platform: "Website",
  demographics: "General"
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(res => res.text())
.then(text => console.log('Response:', text))
.catch(err => console.error('Error:', err));
