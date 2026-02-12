import { useEffect, useState, useRef} from "react";
import { protraitRender } from "../../Scripts/1";
import React from "react";
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { Box } from "@mui/material";
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

import "./About.css";
export function About() {

    let [realPic, setreaPic] = useState(0)
    let [isShortVersion, setShortVersion] = useState(false)
    const canvasRef = useRef(null);
    const cancelRef = useRef(null); // stores cancel function
  
    
    useEffect(() => {
        if(realPic === 0)
        {
            const canvas = canvasRef.current;
            if(canvas)
            {
                // Clear canvas before starting new animation
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelRef.current = protraitRender(canvasRef.current)
            }
        }
        }, [realPic]);

    
    function changePic()
    {

        setreaPic(prev =>{
                let curr = (prev == 0? 1 : 0)
                if(curr == 1)
                {
                    // Cancel any existing animation
                    if (cancelRef.current) {
                      console.log("Canceling previous animation");
                      cancelRef.current();
                }
            }
            return curr;
        })
    }

    const theme = createTheme({
        typography: {
            fontFamily: 'cursive',
            fontSize: '14',
            }
    })
    const longVersion = () =>
    {
        return (
            <ThemeProvider theme={theme}>
            <Stack direction="column"
            spacing={3}
            alignItems="flex-start"
            sx={{
                paddingLeft: "40px"
            }}>
                <Typography textAlign="left" sx = {{fontSize: "14px"}}><em>*Hi, If you see an animated face on the left, please click the face to add a mood for me</em></Typography>
                <Typography textAlign="left" sx = {{fontSize: "14px"}}><em>*If you see the animated face is stretched or animation is laggy... Probably is due to the web loading, please refresh the page if you like</em></Typography>
                <Typography textAlign="left" sx = {{lineHeight: 1.5}}>Hey, I'm Chenming Ye (Kryant Ye). </Typography> 
                <Typography textAlign="left" sx = {{lineHeight: 1.5}}>I'll be a junior starting from the next semester at UW-Madison (Spring 2026) and I'm planning to graduate this academic year!</Typography >  
                <Typography textAlign="left">Currently (summer 2025), I am working at People&Robots Lab as an undergraduate research assisstant with mentor Yaxin Hu focusing on developing autonomous telepresent robots under ROS system</Typography  >
                <Typography textAlign="left">My research interests are broad since there are so many cool techniques I want to explore. However, I aim to focus on robots and visualization research that is able to tackle real human issues</Typography>
                <Typography textAlign="left">Other than academy, I'm a fan of tennis 🎾 and basketball 🏀. Coldplay is my favoriate band. I don't play video games quite often, but nba2k series and Forza Horizon 5 are the games I love to play </Typography>
                <Typography textAlign="left">For more information, welcome to download my resume || cv</Typography  >
                <Typography textAlign="left">If you are tring to contact me, following links might work</Typography >
            </Stack>
            </ThemeProvider>
        );
    }

    function shortVersion()
    {
        return (<ThemeProvider theme = {theme}>
            <Stack direction = "column"
            spacing = {3}
            alignItems = "flex-start"
            sx = {{
                paddingLeft: "40px"
            }}>
                <Typography> <strong>Who are you?</strong></Typography>
            </Stack>
        </ThemeProvider>)
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        if (realPic === 1 && canvas) {
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.src = "Textures/image.png";
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
                ctx.drawImage(img, 100, 50, 300,400); // Draw the image
            };
        }
    }, [realPic]);

    return (
        <div>
            <Grid container spacing = {8}>
                <Grid size = {4}>
                    <Stack direction="column" spacing={5} alignItems="center" >
                        <Box height = {500} width = {500} display = "flex" justifyContent = "center" alignItems = "center">
                        {
                            <canvas ref={canvasRef} height={500} width={500}></canvas>
                        }
                        </Box>
                        <Button onClick = {changePic}> {realPic === 0? "Real Me": "Animated Me"}</Button>
                    </Stack>
                </Grid>
                <Grid size = {8}>
                    <Box  style = {{height: "75vh"}}>
                    {
                        isShortVersion === false? longVersion():shortVersion()
                    }
                    </Box>
                </Grid>
            </Grid>

        </div>
    );
}