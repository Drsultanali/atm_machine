import inquirer from "inquirer";

interface User {
    username: string;
    pin: string;
    balance: number;
}

const users: User[] = [
  
    {
        username: "sultan",
        pin: "1234",
        balance: 540002,
    },
    {
        username: "ali",
        pin: "5678",
        balance: 45030,
    },
    {
        username: "mubarak",
        pin: "1000",
        balance: 520500,
    },
    {
        username: "ahmad",
        pin: "1684",
        balance: 600000,
    },
    {
        username: "emilyTaylor22",
        pin: "2687",
        balance: 250000,
    },

];

function loginUser(username: string, PIN: string): User | undefined {
  return users.find((user) => user.username === username && user.pin === PIN);
}


function checkAccountBalance(user: User): void {
    console.log(`Your account balance is = ${user.balance}`);
}

async function withdrawMoney(user: User): Promise<void> {
    const withdrawAmount = await inquirer.prompt([
        {
            name: "amount",
            type: "input",
            message: "Enter the amount to withdraw:",
            validate(input) {
                const amount = parseFloat(input);
                if (!isNaN(amount) && amount > 0 && amount <= user.balance) {
                    return true;
                }
                return "Invalid amount or insufficient funds.";
            },
        },
    ]);

    const amountToWithdraw = parseFloat(withdrawAmount.amount);
    user.balance -= amountToWithdraw;
    console.log(`Successfully withdrew $${amountToWithdraw}. Your updated balance is $${user.balance}`);
}

async function main(): Promise<void> {
    const loginData = await inquirer.prompt([
        {
            name: "username",
            type: "input",
            message: "Enter your username?",
        },
        {
            name: "PIN",
            type: "password",
            message: "Enter your secret PIN?",
            mask: "*",
            validate(input) {
                if (input.length === 4) {
                    return true;
                }
                return false;
            },
        },
    ]);

    const loggedInUser = loginUser(loginData.username, loginData.PIN);

    if (loggedInUser) {
        console.log(`Welcome back ${loginData.username}!`);

        const options = await inquirer.prompt([
            {
                type: "list",
                name: "option",
                message: "Choose what you wanna do?",
                choices: ["CHECK_ACCOUNT_BALANCE", "WITHDRAW_MONEY"],
            },
        ]);

        switch (options.option) {
            case "CHECK_ACCOUNT_BALANCE":
                checkAccountBalance(loggedInUser);
                break;
            case "WITHDRAW_MONEY":
                await withdrawMoney(loggedInUser);
                break;
            default:
                console.log("Invalid option");
        }
    } else {
        console.log(`Username or Password is incorrect.`);
    }
}

main();
