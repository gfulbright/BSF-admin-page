import { useState, useRef, useEffect} from 'react';
import axios from 'axios'

let hidden = true;

 
const Tickets = () => {
  
  //const [ticketCode, setTicketCode] = useState('');
  const [ticketList, setTicketList] = useState([]);
  let count = ticketList.length;
  //const ticketRef = useRef(null);
  
  // READ
  axios.get(`${process.env.REACT_APP_HOST}/api/readTickets`).then((response) => {
    setTicketList(response.data)
    count = ticketList.length;
  })
  
  // CREATE
  function insertCodes(codes)
  {
    // Insert codes and update ticketList
    codes.forEach(code => {
      console.log("in foreach: " + code.toString())
      axios.post(`${process.env.REACT_APP_HOST}/api/createTickets`, {tCode: code}).then((response) => {
        setTicketList([...ticketList, {ticketCode: code}]
        )
      })
    })
    
    // Update count
    count = ticketList.length;
  }
  
  function handleUploading()
  {
    let ticketCodes = [];
    
    // Get csv Input file
    const csvInput = document.getElementById("csvFile")
    const csvFile = csvInput.files[0]
    if(!csvFile)
    {
      alert("Please select a file.")
      return
    }
    if(!csvFile.name.endsWith(".csv"))
    {
      alert("Please select a .csv file.")
      return
    }
    
    // Read input file into array
    const reader = new FileReader()
    reader.readAsText(csvFile)
    reader.onload = function() {
      ticketCodes = reader.result.split('\r\n')
      ticketCodes.splice(-1);
      //console.log(ticketCodes)
      
      // Update Database
      insertCodes(ticketCodes)
      ticketCodes = []
    }
    reader.onerror = function() {
      alert(reader.error);
      return
    }
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
      renderBtn.innerHTML = `Hide <p>Vouchers</p>`
    }
    else
    {
      hidden = true
      tickets.style.display = "none"
      renderBtn.innerHTML = `Show Vouchers <p>(${count} Available)</p>`
    }
  }
  
  return(
    <div id="ticketDiv">
      <h2>Tickets</h2>
      <div id="tickets">
        {ticketList.map((val, k) => {
          return (
          <div key={k}>
            <div>{val.ticketCode},{val.is_issued}</div>
          </div>)
        })}
      </div>
      
      
      <button id="renderBtn" className='adminBtn' onClick={handleRendering}>Show Vouchers <p>({count} Available)</p></button>
      <button id="issueBtn" className='adminBtn' onClick={()=>{
        alert("Future expansion: Issue vouchers to volunteers from user-selected date")
      }}>Issue Vouchers</button>
      <button id="emailBtn" className='adminBtn' onClick={()=>{
        alert("Future expansion: Email issued vouchers to volunteers")
       }}>Email Vouchers</button>
      <button id="uploadBtn" className='adminBtn' onClick={handleUploading}>Upload Vouchers</button>
      <div id="fileInput">
        <label htmlFor="csvFile" >Upload .csv File:</label>
        <input type="file" id="csvFile" name="csvFile" accept=".csv" />
      </div>
    </div>
  )
}

export default Tickets;
