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
    
    console.log(data)

    let parentdiv = document.createElement("div");
    parentdiv.className = 'container';
    parentdiv.id = data.id;
    document.getElementById("data-box").appendChild(parentdiv);

    let divcontainer = document.createElement("div");
    divcontainer.className = 'disp-fl fl-d-c al-c';
    
    let divspan = document.createElement("div");
    divspan.className = 'disp-fl j-c-sp-ard mg-15px';
    
    let divbio = document.createElement("div");
    divbio.className = 'disp-fl j-c-c mg-15px';
    
    let img = document.createElement("img");
    img.src = data.avatar_url;
    img.className = 'b-rad-100pc img-s mg-15px';
    
    let a = document.createElement("a");
    a.innerHTML = data.login;
    a.href = data.html_url;
    a.className = 'txt-decoration mg-15px';

    let spandepots = document.createElement("span");
    spandepots.innerHTML = "Dépôts: " + data.public_repos;
    
    let spanfollowers = document.createElement("span");
    spanfollowers.innerHTML = "Followers: " + data.followers;
    
    let spanbio = document.createElement("span");
    if (data.bio == null) {
        spanbio.innerHTML = "Biographie: Cet utilisateur n'a pas de biographie";
    } else {
        spanbio.innerHTML = "Biographie: " + data.bio;
    }    

    parentdiv.appendChild(divcontainer);
    parentdiv.appendChild(divspan);
    parentdiv.appendChild(divbio);
    divcontainer.appendChild(img);
    divcontainer.appendChild(a);
    divspan.appendChild(spandepots);
    divspan.appendChild(spanfollowers);
    divbio.appendChild(spanbio);
       
}

function generateHTMLFollowers(data, id) {
    
    console.log(data)
    console.log(id)

    if (data.length > 0) {

        let parentdiv = document.createElement("div");
        document.getElementById(id).appendChild(parentdiv);
        parentdiv.className = 'disp-i-blck mg-l-170px pad-10px-0';
        
        let divdropdown = document.createElement("div");
        divdropdown.className = 'dropdown';
        
        let divdropdowncontent = document.createElement("div");
        divdropdowncontent.className = 'dropdown-content';

        let button = document.createElement("button");
        button.className = 'dropbtn';
        button.innerHTML = "Voir les followers";
        
        parentdiv.appendChild(divdropdown)
        divdropdown.appendChild(divdropdowncontent);
        divdropdown.appendChild(button);
        
        for (let i = 0; i < data.length; i++) {
            let a = document.createElement("a");
            divdropdowncontent.appendChild(a);
            a.innerHTML = data[i].login;
            a.href = data[i].html_url;
        }
    }
}

function generateHTMLRepos(data, id) {

    console.log(data)
    console.log(id)
    
    if (data.length > 0) {

        let parentdiv = document.createElement("div");
        document.getElementById(id).appendChild(parentdiv);
        parentdiv.className = 'disp-i-blck mg-l-178px';

        let divdropdown = document.createElement("div");
        divdropdown.className = 'dropdown';
        
        let divdropdowncontent = document.createElement("div");
        divdropdowncontent.className = 'dropdown-content';

        let button = document.createElement("button");
        button.className = 'dropbtn';
        button.innerHTML = "Voir les dépôts";
        
        parentdiv.appendChild(divdropdown)
        divdropdown.appendChild(divdropdowncontent);
        divdropdown.appendChild(button);
        
        for (let i = 0; i < data.length && i < 3; i++) {
            let a = document.createElement("a");
            divdropdowncontent.appendChild(a);
            a.innerHTML = data[i].name;
            a.href = data[i].html_url;
        }
    }
}

getFile()