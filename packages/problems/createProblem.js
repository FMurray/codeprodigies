const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const { generateProblemTemplate } = require('./problemTemplate');

inquirer.prompt([
    {   
        name: "problemName",
        message: "What's the problem called? in camelCase",
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
    },
    {
        name: "tags",
        message: "add some tags, separated by a comma",
        type: "input"
    }
]).then((answers) => {
    fs.writeFileSync(`./${answers.problemType}/${answers.problemName}.js`, generateProblemTemplate(answers.problemName), handleWriteError )
    fs.appendFileSync('./problems.js', `\nproblems[${answers.problemName}] = ${buildProblemMetadata(answers)}`, handleWriteError)
})

function getProblemTypes() {
    return fs.readdirSync(path.resolve(__dirname), {withFileTypes: true})
        .filter(dir => dir.isDirectory() && dir.name.charAt(0) != "_")
        .map(dir => dir.name)
}

function buildProblemMetadata(answers) {
    return `{
        type: ${answers.problemType},
        tags: [${answers.tags.split(",").map(val => val.trim())}]
    }
    `
}

function handleWriteError(err) {
    if (err) {
        console.error(err)
        return
    }
}