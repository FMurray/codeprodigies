const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const { generateProblemTemplate } = require('./problemTemplate');

inquirer.prompt([
    {   
        name: "problemName",
        message: "What's the problem called?",
        default: "",
        validate: (val) => {
            if(val.length == 0) {
                return false
            }
            return true
        }
    },
    {
        type: "list",
        name: "problemType",
        message: "What's the type of the problem?",
        choices: getProblemTypes()
    }
]).then((answers) => {
    fs.writeFile(`./${answers.problemType}/${answers.problemName}.js`, generateProblemTemplate(answers.problemName), err => {
        if (err) {
            console.error(err)
            return
        }
    })
})

function getProblemTypes() {
    return fs.readdirSync(path.resolve(__dirname), {withFileTypes: true})
        .filter(dir => dir.isDirectory() && dir.name.charAt(0) != "_")
        .map(dir => dir.name)
}