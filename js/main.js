function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

// Reads file and converts to
function readFile(file) {
    console.log(`Reading file from ${path_platform_list_json} ...`)
    let rawFile = new XMLHttpRequest();
    let data = null;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                data = JSON.parse(rawFile.responseText);
                // console.log(data);
            }
        }
    }
    rawFile.send(null);
    return data;
}
docReady(function () {
    // Read file
    path_platform_list_json = "_data/platform_list.json"
    platform_list = readFile(path_platform_list_json);
    console.log("platform_list", platform_list)

    // Post loading
    document.body.classList.remove("is-loading");
    const mainSection = document.getElementById("main-section");
    var listOfPlatforms = [];
    // mainSection.innerHTML = ig.display();

    for (let i = 0; i < platform_list.length; i++) {
        const element = platform_list[i];
        if (undefined == element.name ||
            // undefined == element.className || // this is optional
            undefined == element.link) {
            console.log("Invalid json.")
            // Handling ... but its okay for now, cuz only me using it hehe
            return;
        }

        listOfPlatforms.push(new Platform(element.name, element.className, element.link))
    }

    // console.log(listOfPlatforms);
    // const jsonData = JSON.stringify(listOfPlatforms, null, 2);
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
