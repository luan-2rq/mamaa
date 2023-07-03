import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap';
import './NavBar.css'

const NavBar = () => {
  return (
    /* alinhe conteudo da navbar no centro*/

    <Navbar className="NavBar justify-content-center" bg="dark" variant="dark" expand="lg">
      <Navbar.Brand className="mx-auto" href="#">Ações FAANG</Navbar.Brand>
    </Navbar>
  )
}

export default NavBar