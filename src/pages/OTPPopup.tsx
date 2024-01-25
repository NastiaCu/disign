import React, { FC, ReactElement, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";

interface OTPPopupProps {
  open: boolean;
  onClose: () => void;
  onVerifyOTP: (otp: string) => void;
}

const OTPPopup: FC<OTPPopupProps> = ({ open, onClose, onVerifyOTP }): ReactElement => {
  const [otp, setOTP] = useState("");

  const handleVerifyOTP = () => {
    onVerifyOTP(otp);
    setOTP(""); // Reset OTP field after verification
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogContent>
        <TextField
          variant="filled"
          label="OTP"
          type="text"
          fullWidth
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
        />
        <Button onClick={handleVerifyOTP} variant="contained" fullWidth>
          Verify OTP
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OTPPopup;
