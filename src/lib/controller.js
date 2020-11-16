exports.createRandomString = (async ()=> {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for(let i = 0; i < 5; i++){
      text += await possible.charAt(Math.floor(Math.random() * 5));
  };
  console.log(typeof text);
  return text;
});