import { useState, useRef, useEffect} from 'react';
import axios from 'axios'

 let hidden = true;
 
const Tickets = () => {
  
  /*let ticketList = [{ticketCode: "bsftest01", is_issued: false},
                    {ticketCode: "bsftest02", is_issued: false},
                    {ticketCode: "bsftest03", is_issued: false}
  ];*/
  //const [ticketCode, setTicketCode] = useState('');
  const [ticketList, setTicketList] = useState([]);
  let count = ticketList.length;
  //const ticketRef = useRef(null);
  axios.get(`${process.env.REACT_APP_HOST}/api/readTickets`).then((response) => {
    setTicketList(response.data)
  })
  
  // READ
  function handleUploading()
  {
    // Prompt user for filepath, read in CSV, update database, update list
    let list = [];
  }
  
  function handleRendering()
  {
    // Display list
    const renderBtn = document.getElementById("renderBtn")
    const tickets = document.getElementById("tickets")
    if(hidden)
    {
      hidden = false
      tickets.style.display= "block"
      renderBtn.innerHTML = `Hide Remaining Vouchers`
    }
    else
    {
      hidden = true
      tickets.style.display = "none"
      renderBtn.innerHTML = `Show Remaining ${count} Vouchers`
    }
  }
  
  function handleIssuing()
  {
    // Somehow let the admin choose users?  Or select all users from that day?
  }
  
  return(
    <div id="ticketDiv">
      <h2>Tickets</h2>
      <div id="tickets">
        {ticketList.map((val, k) => {
          return (
          <div key={k}>
            <div>{val.ticketCode}, {val.is_issued}</div>
          </div>)
        })}
      </div>
      
      
      <button id="renderBtn" onClick={handleRendering}>Show {count} Remaining Vouchers</button>
      <button id="uploadBtn" onClick={handleUploading}>Upload Vouchers</button>
      <button id="issueBtn" onClick={handleIssuing}>Issue Vouchers</button>
      <button id="emailBtn" onClick={()=>{alert("Emails sent (Demo)")}}>Email Vouchers</button>
    </div>
  )
}

export default Tickets;
