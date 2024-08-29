// Define updateTable in the global scope
async function updateTable() {
    try {
        const response = await fetch('/data');
        const result = await response.json();

        // Extract column names from the database
        const columns = Object.keys(result.data[0]);

        // Find the row that is closest to the current time
        const now = new Date();
        let closestIndex = 0;
        let closestDiff = Math.abs(new Date(result.data[0].FyH) - now);

        for (let i = 1; i < result.data.length; i++) {
            const diff = Math.abs(new Date(result.data[i].FyH) - now);
            if (diff < closestDiff) {
                closestDiff = diff;
                closestIndex = i;
            }
        }

        // Populate the table
        const tableBody = document.querySelector('#forecastTable tbody');
        tableBody.innerHTML = ''; // Clear existing table data

        result.data.forEach((row, index) => {
            const tr = document.createElement('tr');

            // Add highlight to the closest row
            if (index === closestIndex) {
                tr.classList.add('highlight-row');
            }

            columns.forEach(col => {
                let cellValue = row[col];

                if (col !== 'FyH') {
                    cellValue = parseFloat(cellValue).toFixed(1); // Format numeric values
                }

                const td = document.createElement('td');
                td.textContent = cellValue;
                tr.appendChild(td);
            });

            tableBody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }

    // Turn table into a DataTable object
    $('#forecastTable').DataTable({
        paging: false,
        scrollY: 250,
        searching: false,
        info: false
    });

}

// Run updateTable when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    updateTable();

    // Refresh every 30 minutes
    setInterval(updateTable, 30 * 60 * 1000);
});