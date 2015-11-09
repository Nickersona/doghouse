import React from 'react'
import {Link} from 'react-router'
import atomic from 'atomicjs'
import moment from 'moment'
import dataTools from '../../../app/dataTools/dataTools'

import ListingTable from '../components/listingTable'

class Home extends React.Component {
  constructor () {
  	super();
  	this.state = {dataSet: []}
  }

  componentWillMount () {
  	let _self = this;
  	atomic.get('/api/listings')
  		.success(function(data, xhr){
  			_self.setState({dataSet: data})
  		})
		.error(function(err, res){
			console.log(err);
		});
  }

  render() {
  	const listings = this.state.dataSet;
    const avgPrice = dataTools.calculateAverage(listings);

    return (
      <div>
        <h2>Home</h2>
        <h3>{listings.length} total listings at an average of ${avgPrice}</h3>
        <ListingTable listings={listings} />
      </div>
    )
  }
}

export default Home;