// U36432650

// Fetching the CSV data
d3.csv('mock_stock_data.csv').then(data => {
    data.forEach(d => {
        d.Date = new Date(d.Date);
        d.Price = +d.Price;
    });

    const stockNames = [...new Set(data.map(d => d.Stock))];

    const stockSelect = d3.select('#stock-select');
    stockNames.forEach(stock => {
        stockSelect.append('option')
            .attr('value', stock)
            .text(stock);
    });

// Use D3.js to create a responsive visualization within a 600x600 SVG element. This could be a line chart, bar chart, or another suitable visualization type that effectively represents the stock data.
    const margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 600 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    const svg = d3.select('#chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.Price));

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`);

    svg.append('g')
        .attr('class', 'y axis');

    const updateChart = () => {
        const selectedStock = stockSelect.property('value');
        const startDate = new Date(d3.select('#start-date').property('value'));
        const endDate = new Date(d3.select('#end-date').property('value'));

        const filteredData = data.filter(d => 
            d.Stock === selectedStock &&
            d.Date >= startDate && d.Date <= endDate
        );

        x.domain(d3.extent(filteredData, d => d.Date));
        y.domain([0, d3.max(filteredData, d => d.Price)]);

        svg.select('.x.axis')
            .call(xAxis);

        svg.select('.y.axis')
            .call(yAxis);

        const path = svg.selectAll('.line')
            .data([filteredData]);

        path.enter().append('path')
            .attr('class', 'line')
            .merge(path)
            .attr('d', line);
            
        path.exit().remove();
    };
});
