import * as ressource from "./ressource.module.js";

function getFile() {
    fetch('etudiants.json')
    .then(res => {
        if (res.ok) {
            res.json().then(data => {fetchUrl(data.students)});
        } else {
            document.getElementById("erreur").innerHTML = "Votre fichier n'existe pas";
            document.getElementById("erreur").style.display = "block";
        }
    })
}

function fetchUrl(students) {
    for(let i = 0; i < students.length; i++) {
        let id='';
        let url = [`https://api.github.com/users/${students[i]}`, `https://api.github.com/users/${students[i]}/followers`, `https://api.github.com/users/${students[i]}/repos`];
        for(let j = 0; j < url.length; j++) {
            fetch(url[j], {headers: new Headers({ "Authorization": ressource.token })})
                .then((res) => res.json()).then(data => {if (j == 0) {
                                                            generateHTML(data);
                                                            id = data.id;
                                                        } else if (j == 1) {
                                                            generateHTMLFollowers(data, id);
                                                        } else {
                                                            generateHTMLRepos(data, id);
                                                        }});
        }
    }
}

function generateHTML(data) {

    let div = document.createElement("div");
    div.id = data.id;
    document.getElementById("pseudo").appendChild(div);
    div.className = 'container';
    
    let img = document.createElement("img");
    div.appendChild(img);
    img.src = data.avatar_url;
    img.className = 'b-rad-100pc img-s';
    
    let a = document.createElement("a");
    div.appendChild(a);
    a.innerHTML = data.login;
    a.href = data.html_url;
    a.className = 'txt-decoration';
    
    let p = document.createElement("p");
    div.appendChild(p);
    p.innerHTML = "Dépôts: " + data.public_repos;
    
    let p1 = document.createElement("p");
    div.appendChild(p1);
    p1.innerHTML = "Followers: " + data.followers;
    
    let p3 = document.createElement("p");
    div.appendChild(p3);
    if (data.bio == null) {
        p3.innerHTML = "Biographie: Cet utilisateur n'a pas de biographie";
    } else {
        p3.innerHTML = "Biographie: " + data.bio;
    }    
}

function generateHTMLFollowers(data, id) {
    console.log(id)
    let div = document.createElement("div");
    document.getElementById(id).appendChild(div);
    if (data.length > 0) {
      let span = document.createElement("span");
      div.appendChild(span);
      span.innerHTML = "Followers: ";
      
      for (let i = 0; i < data.length; i++) {
        let a1 = document.createElement("a");
        div.appendChild(a1);
        a1.innerHTML = data[i].login;
        a1.href = data[i].html_url;
      }
    }
}

function generateHTMLRepos(data, id) {
    console.log(id)
    let div = document.createElement("div");
    document.getElementById(id).appendChild(div);
    if (data.length > 0) {
      let span = document.createElement("span");
      div.appendChild(span);
      span.innerHTML = "Dépôts: ";
      
      for (let i = 0; i < data.length; i++) {
        let a1 = document.createElement("a");
        div.appendChild(a1);
        a1.innerHTML = data[i].name;
        a1.href = data[i].html_url;
      }
    }
}

getFile()