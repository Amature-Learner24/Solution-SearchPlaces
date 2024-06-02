document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    const resultsTableBody = document.querySelector('#resultsTable tbody');
    const spinner = document.getElementById('spinner');

    // Event listener for CTRL/CMD + / keyboard shortcut
    document.addEventListener('keydown', function(event) {
        const isCtrlOrCmdPressed = event.ctrlKey || event.metaKey; 
        if (isCtrlOrCmdPressed && event.key === '/') {
            event.preventDefault(); 
            searchBox.focus(); 
        }
    });

    // Event listener for Enter key press in search box
    searchBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const searchTerm = searchBox.value.trim();
            if (searchTerm !== '') {
                fetchData(searchTerm)
                    .then(data => {
                        displayResults(data);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        displayNoResults();
                    });
            } else {
                displayStartSearching();
            }
        }
    });

    // Function to fetch data based on search term
    async function fetchData(searchTerm) {
        const apiKey = '11efdb0bc0mshe55c664798593a8p1b02abjsn6328659c3e73'; 
        const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(searchTerm)}`;

        try {
            spinner.style.display = 'block'; 
            const response = await axios.get(url, {
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                }
            });
            spinner.style.display = 'none'; 
            return response.data.data; 
        } catch (error) {
            spinner.style.display = 'none'; 
            throw new Error('Failed to fetch data');
        }
    }

    // Function to display results in the table
    function displayResults(data) {
        if (data.length === 0) {
            displayNoResults();
            return;
        }

        resultsTableBody.innerHTML = ''; 
        data.forEach((city, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${city.city}</td>
                <td>${city.country ? `<img src="https://www.countryflags.io/${city.countryCode}/flat/24.png" alt="${city.country}" /> ${city.country}` : 'No Country'}</td>
            `;
            resultsTableBody.appendChild(row);
        });
    }

    // Function to display "No results found" message
    function displayNoResults() {
        resultsTableBody.innerHTML = '<tr><td colspan="3">No results found</td></tr>';
    }

    // Function to display "Start searching" message
    function displayStartSearching() {
        resultsTableBody.innerHTML = '<tr><td colspan="3">Start searching</td></tr>';
    }
});
