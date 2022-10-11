import * as ressource from "./ressource.module.js";

function getFile() {
    fetch('etudiants.json')
    .then(res => {
        if (res.ok) {
            res.json().then(data => {fetchUrl(data.students)});
        } else {
            $("#erreur").text("Votre fichier n'existe pas");
            $("#erreur").show();
        }
    })
}

async function fetchUrl(students) {
    for(let student of students) {
        let options = {headers: new Headers({ "Authorization": ressource.token })};
        let id = await fetch(`https://api.github.com/users/${student}`, options)
            .then((res) => res.json())
            .then(generateHTML)
            
        await fetch(`https://api.github.com/users/${student}/followers`, options)
            .then((res) => res.json())
            .then(data => generateHTMLFollowers(data, id))

        await fetch(`https://api.github.com/users/${student}/repos`, options)
            .then((res) => res.json())
            .then(data => generateHTMLRepos(data, id))
                                                        
    }
}

function generateHTML(data) {

    jQuery('<div>', {
        id: data.id,
        class: 'container'
    }).appendTo("#data-box");

    jQuery('<div>', {
        id: `img-a-${data.id}`,
        class: 'disp-fl fl-d-c al-c'
    }).appendTo(`#${data.id}`);

    jQuery('<div>', {
        id: `span-${data.id}`,
        class: 'disp-fl j-c-sp-ard mg-15px'
    }).appendTo(`#${data.id}`);

    jQuery('<div>', {
        id: `bio-${data.id}`,
        class: 'disp-fl j-c-c mg-15px'
    }).appendTo(`#${data.id}`);

    jQuery('<img>', {
        src: data.avatar_url,
        class: 'b-rad-100pc img-s mg-15px'
    }).appendTo(`#img-a-${data.id}`);

    jQuery('<a>', {
        href: data.html_url,
        class: 'txt-decoration mg-15px'
    }).html(data.login).appendTo(`#img-a-${data.id}`);

    jQuery('<span>', {
    }).html(`Dépôts: ${data.public_repos}`).appendTo(`#span-${data.id}`);

    jQuery('<span>', {
    }).html(`Followers: ${data.followers}`).appendTo(`#span-${data.id}`);

    if (data.bio == null) {
        jQuery('<span>', {
        }).html("Biographie: Cet utilisateur n'a pas de biographie").appendTo(`#bio-${data.id}`);
    } else {
        jQuery('<span>', {
        }).html(`Biographie: ${data.bio}`).appendTo(`#bio-${data.id}`);
    };

    return data.id;
}

function generateHTMLFollowers(data, id) {

    if (data.length > 0) {

        jQuery('<div>', {
            id: data.id,
            class: 'disp-i-blck mg-l-170px pad-10px-0'
        }).appendTo(`#${id}`);

        jQuery('<div>', {
            class: 'dropdown'
        }).appendTo(`#${data.id}`);

        jQuery('<div>', {
            class: 'dropdown-content'
        }).appendTo('dropdown');

        jQuery('<button>', {
            id: `button-${data.id}`,
            class: 'dropbtn'
        }).html("Voir les followers").appendTo('dropdown');

        for (let i = 0; i < data.length; i++) {
            jQuery('<a>', {
                href: data[i].html_url,
                class: 'txt-decoration mg-15px'
            }).html(data[i].login).appendTo('dropdown-content');
        }
    }
}

function generateHTMLRepos(data, id) {
    
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
        $(".loader, lds-facebook").fadeOut( "slow");
    }
}

$(document).ready(function() {
    getFile()
});