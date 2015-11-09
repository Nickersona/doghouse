import React from 'react'
import moment from 'moment'

class ListingTable extends React.Component {
  render() {
  	const listings = this.props.listings;

    return (
	    <table>
	    	<tbody>
	    		<tr>
	    			<th>Price</th>
	    			<th>Sqft</th>
	    			<th>Posted</th>
	    			<th>Link</th>
	    		</tr>
			    {listings.map(function(listing, idx){
			    	let posted = moment(listing.date).format('DD/MM/YYYY');
			    	return  (
			    		<tr key={idx}>
			    			<td>${listing.price}</td>
			    			<td>{listing.sqft}</td>
			    			<td>{posted}</td>
			    			<td><a target="_blank" href={listing.href}>{listing.ListingName}</a></td>
			    		</tr>
			    	)
			    })}
	    	</tbody>
		</table>

    )
  }
}

export default ListingTable;