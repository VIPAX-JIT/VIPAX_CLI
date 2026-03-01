#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
    .name('vipax')
    .description('Vipax CLI - A simple developer toolkit')
    .version('1.0.0', '-v, --version');

program
    .command('greet [name]')
    .description('Greet a user by name')
    .action((name: string = 'World') => {
        console.log(chalk.green(`Hello, ${name}! Welcome to Vipax CLI.`));
    });

program
    .command('add <num1> <num2>')
    .description('Add two numbers')
    .action((num1: string, num2: string) => {
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        if (isNaN(a) || isNaN(b)) return console.log(chalk.red('Please provide valid numbers.'));
        console.log(chalk.cyan(`${a} + ${b} = ${chalk.bold(a + b)}`));
    });

program
    .command('subtract <num1> <num2>')
    .description('Subtract two numbers')
    .action((num1: string, num2: string) => {
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        if (isNaN(a) || isNaN(b)) return console.log(chalk.red('Please provide valid numbers.'));
        console.log(chalk.cyan(`${a} - ${b} = ${chalk.bold(a - b)}`));
    });

program
    .command('multiply <num1> <num2>')
    .description('Multiply two numbers')
    .action((num1: string, num2: string) => {
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        if (isNaN(a) || isNaN(b)) return console.log(chalk.red('Please provide valid numbers.'));
        console.log(chalk.cyan(`${a} x ${b} = ${chalk.bold(a * b)}`));
    });

program
    .command('divide <num1> <num2>')
    .description('Divide two numbers')
    .action((num1: string, num2: string) => {
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        if (isNaN(a) || isNaN(b)) return console.log(chalk.red('Please provide valid numbers.'));
        if (b === 0) return console.log(chalk.red('Cannot divide by zero.'));
        console.log(chalk.cyan(`${a} / ${b} = ${chalk.bold((a / b).toFixed(4))}`));
    });

program
    .command('joke')
    .description('Fetch a random joke')
    .action(async () => {
        try {
            const res = await axios.get('https://official-joke-api.appspot.com/random_joke');
            console.log(chalk.yellow(res.data.setup));
            console.log(chalk.white('>> ' + res.data.punchline));
        } catch {
            console.log(chalk.red('Could not fetch a joke. Check your internet connection.'));
        }
    });

program
    .command('github <username>')
    .description('Fetch GitHub user profile info')
    .action(async (username: string) => {
        try {
            const res = await axios.get(`https://api.github.com/users/${username}`);
            const u = res.data;
            console.log(chalk.green(`\nGitHub: @${u.login}`));
            console.log(`Name        : ${u.name || 'N/A'}`);
            console.log(`Bio         : ${u.bio || 'N/A'}`);
            console.log(`Repos       : ${u.public_repos}`);
            console.log(`Followers   : ${u.followers}`);
            console.log(`Profile     : ${u.html_url}\n`);
        } catch (err: any) {
            if (err.response?.status === 404) {
                console.log(chalk.red(`User "${username}" not found on GitHub.`));
            } else {
                console.log(chalk.red('Could not reach GitHub. Try again later.'));
            }
        }
    });

program
    .command('quote')
    .description('Fetch a random motivational quote')
    .action(async () => {
        try {
            const res = await axios.get('https://dummyjson.com/quotes/random');
            console.log(chalk.italic.magenta(`\n"${res.data.quote}"`));
            console.log(chalk.dim(`  — ${res.data.author}\n`));
        } catch {
            console.log(chalk.red('Could not fetch a quote right now.'));
        }
    });

program
    .command('coinflip')
    .description('Flip a coin — Heads or Tails')
    .action(() => {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        console.log(chalk.yellow(`Coin flip result: ${chalk.bold(result)}`));
    });

program
    .command('roll [sides]')
    .description('Roll a dice (default: 6 sides)')
    .action((sides: string = '6') => {
        const n = parseInt(sides);
        if (isNaN(n) || n < 2) return console.log(chalk.red('Sides must be a number >= 2.'));
        const result = Math.floor(Math.random() * n) + 1;
        console.log(chalk.magenta(`You rolled a d${n} and got: ${chalk.bold(result)}`));
    });

program
    .command('fileinfo <filename>')
    .description('Show file size, extension, and last modified date')
    .action((filename: string) => {
        const filePath = path.resolve(filename);
        if (!fs.existsSync(filePath)) {
            console.log(chalk.red(`File not found: ${filePath}`));
            return;
        }
        const stats = fs.statSync(filePath);
        console.log(chalk.green('\nFile Info:'));
        console.log(`Path      : ${filePath}`);
        console.log(`Extension : ${path.extname(filename) || 'none'}`);
        console.log(`Size      : ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`Modified  : ${stats.mtime.toLocaleString()}\n`);
    });

program.parse(process.argv);
