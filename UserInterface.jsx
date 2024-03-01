import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import './App.css';

const UserInterface = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const PER_PAGE = 20;
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(customers.length / PER_PAGE);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  const handleSort = (columnName) => {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortOrder('asc');
    }
  };

  const sortedCustomers = () => {
    const sortedData = [...customers];

    if (sortBy === 'date' || sortBy === 'time') {
      sortedData.sort((a, b) => {
        if (sortBy === 'date') {
          return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'time') {
          return sortOrder === 'asc' ? a.time.localeCompare(b.time) : b.time.localeCompare(a.time);
        }
        return 0;
      });
    }

    return sortedData.filter((customer) =>
      customer.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || customer.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderCustomers = () => {
    const currentCustomers = sortedCustomers();
    return currentCustomers.slice(offset, offset + PER_PAGE).map((customer) => (
      <tr key={customer.sno}>
        <td>{customer.sno}</td>
        <td>{customer.customer_name}</td>
        <td>{customer.age}</td>
        <td>{customer.phone}</td>
        <td>{customer.location}</td>
        <td>{customer.date}</td>
        <td>{customer.time}</td>
      </tr>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Form className="search-form d-flex mb-3" style={{ margin: '50px 15px' }}>
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline-primary">
          Search
        </Button>
      </Form>
      <div className="sort-by-container" style={{ margin: '10px 0px', textAlign: 'center' }}>
        <Button variant="primary" onClick={() => handleSort('date')} style={{ marginRight: '10px' }}>
          Sort by Date
        </Button>
        <Button variant="primary" onClick={() => handleSort('time')} style={{ marginRight: '10px' }}>
          Sort by Time
        </Button>
      </div>
      <Table striped bordered hover style={{ marginLeft: '16px', width: '98%' }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {renderCustomers()}
        </tbody>
      </Table>

      <div className="pagination-container" style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          variant="primary"
          className="pagination-button"
          onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))}
          disabled={currentPage === 0}
          style={{ marginRight: '10px', width: '87px' }}
        >
          Previous
        </Button>
        <Button
          variant="primary"
          className="pagination-button"
          onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, pageCount - 1))}
          disabled={currentPage === pageCount - 1}
          style={{ marginRight: '10px', width: '87px' }}
        >
          Next
        </Button>
      </div>
      
    </div>
  );
};

export default UserInterface;
