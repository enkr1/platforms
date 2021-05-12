function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function () {
    // ...
    const mainSection = document.getElementById("main-section");
    var listOfPlatforms = [];
    // mainSection.innerHTML = ig.display();

    listOfPlatforms.push(
        new Platform("Personal Website", "website", "https://enkr1.github.io/web/"),
        new Platform("GitHub", "github", "https://github.com/enkr1"),
        new Platform("Facebook", "fb", "https://www.facebook.com/enkrbeatbox"),
        new Platform("YouTube", "yt", "https://www.youtube.com/channel/UCJJmK5bN3b4izpMb2vtRXpw"),
        new Platform("Instagram", "ig", "https://www.instagram.com/enkr1/"),
    );

    // console.log(listOfPlatforms);
    const jsonData = JSON.stringify(listOfPlatforms, null, 2);
    // console.log(jsonData);

    listOfPlatforms.forEach(platform => {
        mainSection.innerHTML += platform.display();
    });

    /*
    // TODO: THE NODE JSON
    const fs = require("browserify-fs");

    const kFile = "main.json"

    // browserify js/main.js -o js/bundle.js
    const saveData = (data, file) => {
        const finished = (error) => {
            if (error) {
                console.error(error);
                return;
            }
        }
        const jsonData = JSON.stringify(data) // , null, 2
        fs.writeFile(file, jsonData, finished);
    }

    saveData(ig, kFile);
    */

});

class Platform {

    constructor(name, className, link) {
        this.name = name;
        this.className = className;
        this.link = link;
    }

    display() {
        return `
            <div class="single-button single-button-${this.className}">
                <a href="${this.link}" target="_blank">
                    <span>${this.name}</span>
                </a>
            </div>
        `;
    }
}