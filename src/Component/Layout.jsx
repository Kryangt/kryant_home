import { useEffect, useRef, useState } from "react";
import {Link, Element} from "react-scroll";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Gallery} from "./Gallery";
import { Timeline } from "./Timeline";
import "./Layout.css";

export function Layout({ showAbout = true }){
    const [showNavbar, setShowNavbar] = useState(false);
    const hideTimerRef = useRef(null);

    useEffect(() => {
        function revealNavbar() {
            setShowNavbar(true);
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = window.setTimeout(() => {
                setShowNavbar(false);
            }, 1400);
        }

        function handleMouseMove(event) {
            if (event.clientY <= 32) {
                revealNavbar();
            }
        }

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", revealNavbar, { passive: true });

        return () => {
            window.clearTimeout(hideTimerRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", revealNavbar);
        };
    }, []);

    return <div>
      <Container className="site-layout" style={{cursor: "default", width: "100%"}}>
        <Navbar
          expand = "sm"
          fixed="top"
          className={`site-navbar ${showNavbar ? "site-navbar--visible" : ""}`.trim()}
          style={{height: '8vh'}}
        >
        <Container>
        <Navbar.Toggle aria-controls="navbarScroll"/>
            <Navbar.Collapse id = "navbarScroll">
                <Nav  style={{ maxHeight: '10%', maxWidth: '100%', cursor: "default"}} className="ms-auto my-2 my-lg-0" navbarScroll>
                    <Link to="About" smooth = {true} duration = {200} offset={-100} className="nav-link mx-2">About</Link>
                    <Link to="Publications" smooth = {true} duration = {200} offset={-100} className="nav-link mx-2">What am I doing</Link>
                    <Link to="Projects" smooth = {true} duration = {200} offset={-100} className="nav-link mx-2">Gallery</Link>
                    <Link to="Timeline" smooth = {true} duration = {200} offset={-100} className="nav-link mx-2">Timeline</Link>
                </Nav>
            </Navbar.Collapse>
    </Container>
    </Navbar>
    {showAbout ? (
      <>
        <br></br>
        <br></br>
      </>
    ) : null}
    <div>
      {showAbout ? (
        <>
          <hr></hr>
          <Element name="About">
            <section style={{ height: '100vh', width: '100%', maxWidth: '90vw', margin: '0 auto' }}>
              <h1>About</h1>
              <br></br>
            </section>
          </Element>
        </>
      ) : null}
      {showAbout ? <hr></hr> : null}
      <Element name="Projects">
      <section className="gallery-section">  
          <h1>Gallery</h1>
          <br></br>
          <Gallery/>
        </section>
      </Element>
      <hr></hr>
      <Element name="Timeline">
        <section className="timeline-section">
          <h1>Timeline</h1>
          <br></br>
          <Timeline/>
        </section>
      </Element>
    </div></Container>
    </div>
}
