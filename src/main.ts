#!/usr/bin/env node

import { program } from "commander";
import figlet from "figlet";
import { PathLike, existsSync } from "fs";
import inquirer from "inquirer";

const header = figlet.textSync("Comic Crate", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
});
console.log(header);

program.version("0.0.1");

program
    .command("archive")
    .option("-d, --directory <directory>", "Directory to archive")
    .option(
        "-o, --output <outputPath>",
        "Output file name default: <directory>.cbz"
    )
    .option(
        "-n, --name <outputName>",
        "Output file name default: <directory>.cbz"
    )
    .option("-f, --format <format>", "Output format (cbz, cbr) [default: cbz]")
    .description("Archive a folder containing images to CBZ/CBR format")
    .action((options) => {
        console.log(options);
    });

program
    .command("extract")
    .description("Extract a CBZ/CBR file")
    .option("-f, --file <file>", "CBZ/CBR file to extract")
    .option(
        "-o, --output <outputPath>",
        "Output directory [default: <file_name>]"
    )
    .action((options) => {
        console.log(options);
    });

const mainMenu = async () => {
    const answer = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What do you want to do?",
            choices: [
                { name: "Archive a folder to CBZ", value: "archive" },
                { name: "Extract a CBZ archive", value: "extract" },
                { name: "Exit", value: "exit" },
            ],
        },
    ]);

    switch (answer.action) {
        case "archive":
            promptArchive();
            break;
        case "extract":
            promptExtract();
            break;
        case "exit":
            console.log("Thank you for using Comic Crate. Goodbye!");
            process.exit(0);
    }
};

const promptArchive = async () => {
    const questions = [
        {
            type: "input",
            name: "directory",
            message: "What directory do you want to archive?",
            validate: (value: PathLike) => {
                if (existsSync(value)) {
                    return true;
                } else {
                    return "Please enter a valid path to a folder.";
                }
            },
        },
        {
            type: "input",
            name: "outputPath",
            message: "Enter the path where you want to save the archive:",
            default: "./",
        },
        {
            type: "input",
            name: "outputName",
            message: "Enter the name of the archive:",
            default: "archive",
        },
        {
            type: "list",
            name: "format",
            message: "What format do you want to use?",
            choices: [
                { name: "CBZ", value: "cbz" },
                { name: "CBR", value: "cbr" },
            ],
        },
    ];

    const answers = await inquirer.prompt(questions);
    console.log(answers);
};

const promptExtract = () => {};

if (process.argv.length > 2) {
    program.parse(process.argv);
} else {
    mainMenu();
}
