import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap';
import './NavBar.css'

const NavBar = () => {
  return (
    <Navbar className="NavBar" bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#">Top Stocks</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar" />
      <Navbar.Collapse id="navbar">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavBar