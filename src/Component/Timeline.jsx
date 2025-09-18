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
                <div class = "container-left">
                    <img src = "Textures/dot.jpg"></img>
                    <div class = "text-box">
                        <h2>The Beginning</h2>
                        <p><small>2004.12.07</small></p>
                        <p>I was born 🎉</p>
                        <span class = "left-arrow"></span>
                    </div>

                </div>

                <div class = "container-right">
                    <img src = "Textures/dot.jpg"></img>
                    <div class = "text-box">
                        <h2>My Kindergarten</h2>
                        <p><small>2007.xx.xx</small></p>
                        <div style = "display: flex;">
                            <img src = "Textures/1.jpg"></img>
                            <p>Big head, small body</p>
                        </div>

                        <span class = "right-arrow"></span>
                    </div>
                </div>

                <div class = "container-left">
                    <img src = "Textures/dot.jpg"></img>
                    <div class = "text-box">
                        <h2>Family Milestone</h2>
                        <p><small>2010.10.24</small></p>
                        <div style = "display: flex;">
                            <p>A little and cute baby came to our family! My little brother!</p>
                            <img src = "Textures/2.jpg"></img>
                        </div>
                        <span class = "left-arrow"></span>
                    </div>
                </div>

                <div class = "container-right">
                    <img src = "Textures/dot.jpg"></img>
                    <div class = "text-box">
                        <h2>Happy Birthday!</h2>
                        <p><small>20xx.10.24 or 20xx.12.07</small></p>
                        <div style = "display: flex;">
                            <img src = "Textures/3.jpg"></img>
                            <p>Happy Birthday to you or to me? (I forgot when the photo was token)</p>
                        </div>
                        <span class = "right-arrow"></span>
                    </div>
                </div> 
        </div>
    )
}
