import React from "react";
import {Link, Element} from "react-scroll";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavLink from "react-bootstrap/esm/NavLink";
import 'bootstrap/dist/css/bootstrap.min.css';
import {About} from "./About";
import {Gallery} from "./Gallery";
import { Timeline } from "./Timeline";
import { Publication } from "./Publication";
export function Layout(){
    return <div>
      <Container style={{cursor: "default", width: "100%"}}>
        <Navbar expand = "sm" bg = "light" fixed="top" style={{height: '8vh'}}>
        <Container>
        <Navbar.Toggle aria-controls="navbarScroll"/>
            <Navbar.Collapse id = "navbarScroll">
                <Nav  style={{ maxHeight: '10%', maxWidth: '100%', cursor: "default"}} className="ms-auto my-2 my-lg-0" navbarScroll>
                    <Link to="About" smooth = {true} duration = {200} offset={-100} className="nav-link mx-2">About</Link>
                    <Link to="Publications" smooth = {true} duration = {200} offset={-100} className="nav-link mx-2">Publications</Link>
                    <Link to="Projects" smooth = {true} duration = {200} offset={-100} className="nav-link mx-2">Gallery</Link>
                    <Link to="Timeline" smooth = {true} duration = {200} offset={-100} className="nav-link mx-2">Timeline</Link>
                </Nav>
            </Navbar.Collapse>
    </Container>
    </Navbar>
    <br></br>
    <br></br>
    <div>
      <hr></hr>
      <Element name="About">
        <section style={{ height: '100vh', width: '100%', maxWidth: '90vw', margin: '0 auto' }}>
          <h1>About</h1>
          <br></br>
          <About/>
        </section>
      </Element>
      <hr></hr>
      <Element name="Publications">
        <section style={{ height: '100vh', width: '100%', maxWidth: '90vw', margin: '0 auto' }}>
          <h1>Publications</h1>
          <br></br>
          <Publication/>
        </section>
      </Element>
      <hr></hr>
      <Element name="Projects">
      <section style={{ height: '100vh', width: '100%', maxWidth: '90vw', margin: '0 auto' }}>  
          <h1>Gallery</h1>
          <p>This is the content of section 2</p>
          <br></br>
          <Gallery/>
        </section>
      </Element>
      <hr></hr>
      <Element name="Timeline">
        <section style={{ height: '100vh', width: '100%', maxWidth: '90vw' }}>
          <h1>Timeline</h1>
          <p>This is the content of section 2</p>
          <br></br>
          <Timeline/>
        </section>
      </Element>
    </div></Container>
    </div>
}
