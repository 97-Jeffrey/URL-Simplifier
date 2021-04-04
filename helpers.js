
function generateRandomString(){
  let str ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let output = "";
  for(let i=0; i<6; i++){
    output += str[Math.floor(Math.random()*str.length)];
  }
  return output;
}

function emailLookUp(users, email){
  for(let user in users){
    if(users[user]["email"] == email){
      return true;
    }
  }
  return false;
}

function getPasswordByEmail(email, users){
  for(let user in users){
    if(users[user]['email'] == email){
      return users[user]["password"];
    }  
  }
  return "";
}

function correctUser(users, email){
  for(let user in users){
    if(users[user]['email'] == email){
      return users[user];
    }
  }
  return {};
}

function urlsForUser(urlDatabase, userId){
   let output ={};
   for(let url in urlDatabase){
     if(urlDatabase[url]["userID"] == userId){
       output[url] = urlDatabase[url];
     }
   }
   return output;
}

module.exports = { generateRandomString, emailLookUp, getPasswordByEmail, correctUser, urlsForUser};