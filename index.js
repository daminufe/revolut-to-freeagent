const {parse} = require('csv-to-json');
const moment = require('moment');
const { EOL } = require('os');
if (process.argv.length === 2) {
    console.error('No CSV passed');
    process.exit(9);
}

const filename = process.argv[2];

parse({filename}, (err, json) => {
    const formatDescription = (transaction) => {
        let result = '';

        if (transaction.Reference) {
            result += `${transaction.Reference}: `;
        }

        result += `${transaction.Description} (${transaction['Orig currency']})`;
        result = result.replace(',', '-');
        return result;
    };

    let result = '';

    json.forEach(transaction => {
        if (transaction.Amount) {
            const obj = {
                date: moment(transaction.Date).format('DD/MM/YYYY'),
                amount: transaction.Amount,
                description: formatDescription(transaction)
            };

            result += `${obj.date},${obj.amount},${obj.description}${EOL}`;
        }
    });

    const filename = `${process.argv[2].replace('.csv', '_freeagent.csv')}`;

    require('fs').writeFile(filename, result);
});
