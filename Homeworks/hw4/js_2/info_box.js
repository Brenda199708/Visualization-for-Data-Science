/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {
        this.data = data
    }

    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCountry, activeYear) {
        // ******* TODO: PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected country, region, population and stats associated with the country.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCountry data from each array
         * you will then pass the data as paramters to make an InfoBoxData object for each category
         *
         */

        //TODO - Your code goes here -
        // console.log(this.data);
        this.clearHighlight();

        let that = this;

        if (! that.data['population'].find(d => d.geo == activeCountry)) {
            return undefined;
        }
        let infoDataArray = Object.keys(this.data).map(function (key) {
            let countryData = that.data[key].find(d => d.geo == activeCountry);
            let region = that.data['population'].find(d => d.geo == activeCountry).region;
            let indicator_name = countryData.indicator_name;
            let value = countryData[activeYear];
            console.log(countryData[activeYear]);
            return new InfoBoxData(countryData.country, region, indicator_name, value);
        });


        let countryRegion = infoDataArray[0];
        let titlePane = d3.select('#country-detail').selectAll('span#infoTitle').data([{'country' : countryRegion.country,
                                                                                        'region' : countryRegion.region}]);
        titlePane.exit().remove();
        let titlePaneEnter = titlePane.enter()
                                      .append('div')
                                      .classed('label', true)

        titlePane = titlePane.merge(titlePaneEnter);

        titlePane.append('i')
                 .attr('class', d => d.region)
                .classed('fas fa-globe-asia', true)

        titlePane.append('span')
                 .attr('id', 'infoTitle')
                 .attr('style', 'color:black')
                 .text(d => ' ' +  d.country);


        let textBox = d3.select('#country-detail').selectAll('div#info').data(infoDataArray);
        textBox.exit().remove();
        let textBoxEnter = textBox.enter().append('div').classed('stat', true).attr('id', 'info');
        textBox = textBox.merge(textBoxEnter)
        textBox.append('text').text(d => d.indicator_name + ' : ' + d.value);
    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {
        d3.select('#country-detail').html('');
        //TODO - Your code goes here -
    }

}
