import React, { ReactElement, FC } from "react";
import { Box, Typography } from "@mui/material";

const About: FC<any> = (): ReactElement => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "16px",
      }}
    >
      <Typography variant="h3" sx={{ color: "#FFFFFF" }}>
        Welcome to DiSign,
      </Typography>
      <Typography variant="h5" sx={{ marginTop: 2, color: "#FFFFFF" }}>
        Where cutting-edge technology meets friendly design to redefine the way
        you sign and secure your digital documents.
      </Typography>
      <Typography variant="h5" sx={{ marginTop: 2, color: "#FFFFFF" }}>
        At DiSign, we understand the importance of a seamless and
        user-friendly experience. Our mission is to empower you with a digital
        signature solution that not only prioritizes security but also enhances
        your overall interaction with the signing process.
      </Typography>
      <Typography variant="h4" sx={{ marginTop: 4, fontWeight: "bold", color: "#FFFFFF" }}>
        Friendly Design:
      </Typography>
      <Typography variant="h5" sx={{ marginTop: 2, color: "#FFFFFF" }}>
        We believe that technology should be approachable and user-centric. Our
        intuitive interface ensures that signing digital documents is not only
        efficient but also enjoyable. With a clean and user-friendly design,
        DiSign simplifies the digital signing experience, making it accessible
        to users of all backgrounds.
      </Typography>
      <Typography variant="h4" sx={{ marginTop: 4, fontWeight: "bold", color: "#FFFFFF" }}>
        Secure Digital Signature:
      </Typography>
      <Typography variant="h5" sx={{ marginTop: 2, color: "#FFFFFF" }}>
        Жили-были три китайца: Як, Як-цедрак, Як-цедрак-цедрак-цедрони.
        Жили-были три китайки: Цыпа, Цыпа-дрыпа, Цыпа-дрыпа-дрымпампони.
        Все они переженились: Як на Цыпе, Як-цедрак на Цыпе-дрыпе,
        Як-цедрак-цедрак-цедрони на Цыпе-дрыпе-дрымпампони.
        И у них родились дети. У Яка с Цыпой — Шах, у Яка-цедрака с Цыпой-дрыпой — Шах-шарах, 
        у Яка-цедрака-цедрака-цедрони с Цыпой-дрыпой-дрымпампони — Шах-шарах-шарах-широни.
      </Typography>
    </Box>
  );
};

export default About;
