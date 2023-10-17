import React, {ReactElement, FC} from "react";
import {Box, Button, Typography} from "@mui/material";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const Home: FC<any> = (): ReactElement => {
    return (
        <Box py={4}
            sx={{
            mx: "50px",
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: "center"
        }}>
             <Typography variant="h2" mb={1} fontWeight={500} color="primary.contrastText"> 
                DiSign
            </Typography>
            <Typography variant="h5" mb={3} color="primary.contrastText"> 
                Traditional paper-based document signing processes are often time-consuming, costly, and environmentally unsustainable. Moreover, the rise of remote work and the need for contactless transactions have accelerated the demand for reliable digital signature solutions. Existing digital signing platforms may lack robust security measures or fail to provide a pleasant user experience. Moreover, all of them require a paid account in order to sign documents digitally.
            </Typography>

            <Button type="submit" variant="contained" 
                sx={{
                    my: "1rem", 
                    color: "primary.contrastText", 
                    fontSize: "large",
                    textTransform: "none", 
                    backgroundColor: "primary.light",
                    padding: "10px 30px",
                    borderRadius: "1rem"
                }}
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "large"}}/>}
                >
                Get Started
            </Button>

        </Box>
    );
};

export default Home;
