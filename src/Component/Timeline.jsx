import React, { useEffect, useRef, useState } from "react";
import './Timeline.css';

export function Timeline(){
    const timelineRef = useRef(null);
    const [visible, setVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect(); // Trigger only once
          }
        },
        { threshold: 0.3 } // 30% of element visible to trigger
      );
  
      if (timelineRef.current) {
        observer.observe(timelineRef.current);
      }
  
      return () => observer.disconnect();
    }, []);
   
    return (
        <div
        className={`timeline ${visible ? "animate" : ""}`}
        ref={timelineRef}>

            
                <div className = "container-left">
                    <img className = "icon" src = "Textures/dot.jpg"></img>
                        <div className = "text-image">
                            <div className = "text-box">
                                <h2>The Beginning</h2>
                                <p><small>2004.12.07</small></p>
                                <p>I was born 🎉</p>
                            </div>
                            <span className = "left-arrow"></span>
                        </div>
                </div>

                <div className = "container-right">
                    <img className = "icon" src = "Textures/dot.jpg"></img>
                        <div className = "text-image">
                        <div className = "text-box">
                            <h2>My Kindergarten</h2>
                            <p><small>2007.xx.xx</small></p>
                            <p>Big head, small body</p>
                            <span className = "right-arrow"></span>
                        </div>
                        <img className = "image-content"src = "Textures/1.jpg"></img>
                        </div>
                </div>

                <div className = "container-left">
                    <img className = "icon" src = "Textures/dot.jpg"></img>
                    <div className = "text-image">
                        <img className = "image-content"src = "Textures/2.jpg"></img>
                        <div className = "text-box">
                            <h2>Family Milestone</h2>
                            <p><small>2010.10.24</small></p>
                            <p>A little and cute baby came to our family! My little brother!</p>
                            <span className = "left-arrow"></span>
                        </div>
                    </div>
                </div>

                <div className = "container-right">
                    <img className = "icon" src = "Textures/dot.jpg"></img>
                    <div className = "text-image">
                        <div className = "text-box">
                            <h2>Hi, Madison</h2>
                            <p><small>2023.09.06</small></p>
                            <p>Came to an unfamilar land and started a new life chapter. Coexistent of excitement and anxiety</p>
                            <span className = "right-arrow"></span>
                        </div>
                        <img className = "image-content"src = "Textures/4.jpg"></img>
                    </div>
                </div>

                <div className = "container-left">
                    <img className = "icon" src = "Textures/peopleandrobot.jpg"></img>
                    <div className = "text-image">
                        <div className = "text-box">
                            <h2>Hi, Research</h2>
                            <p><small>2025.2.14</small></p>
                            <p>I'm glad to become a part of People and Robots lab to conduct related to Human-Computer Interaction with mentor Yaxin Hu and PI Prof.Mutlu</p>
                            <span className = "left-arrow"></span>
                        </div>
                    </div>
                </div>

        </div>
    )
}
