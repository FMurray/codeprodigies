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
        type: ${answers.problemType}
    }
    `
}

function handleWriteError(err) {
    if (err) {
        console.error(err)
        return
    }
}