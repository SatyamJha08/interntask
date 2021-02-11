/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
    Paper,
    TextField,
    Button,
    IconButton
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import axios from 'axios';

import Otp from './components/Otp';
import { obj } from "./data";
function isNumeric(n) {
    return !isNaN(parseInt(n)) && isFinite(n);
}

//const obj = require('./mobile.json');

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            pno: '',
            otpShow: false,
            otp: ''
        };
    }

    _getCode = async () => {
        const e = this.state.code + this.state.pno;
        await axios.get("http://localhost:8000/verify/getcode", {
            params: {
                phonenumber: e,
                channel: 'sms'
            }
        })
            .then(data => console.log(data))
            .catch(err => console.log(err));
    };

    _verifyCode = async () => {
        const e = this.state.code + this.state.pno;
        await axios.get("http://localhost:8000/verify/verifycode", {
            params: {
                phonenumber: e,
                code: this.state.otp
            }
        })
            .then(data => {
                if (data.data.valid) {
                    var searchVal = this.state.pno;
                    //console.log(typeof (this.state.pno));
                    //console.log(obj.mobile.length);
                    let flag = 0;
                    for (let i = 0; i < obj.mobile.length; i++) {
                        //console.log(obj.mobile[i]);
                        if (obj.mobile[i] === searchVal) {
                            flag = 1;
                            //console.log("success,mobile number found, please signin");
                        }
                    }
                    if (flag) {
                        alert("success,mobile number found, please signin");
                        //console.log("success,mobile number found, please signin");
    
                    }
                    else {
                        <button>Signuo</button>
                        alert("success,mobile number not found, please signup");
                    }
                    //console.log("success,mobile number not found, please signup");
                }
                else {
                    alert("invalid OTP");
                    //console.log("invalid OTP")
                }
                console.log(data)
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(160, 160, 160, 0.2)',
                height: '100vh'
            }}>
                <Paper elevation={4} style={{ padding: 20, width: 300, marginBottom: 60 }}>
                    {!this.state.otpShow ? <h3 style={{ marginLeft: 10, color: '#9f9f9f' }}></h3> : <IconButton onClick={() => {
                        this.setState({ otpShow: false, otp: '' });
                    }} size="small"><ArrowBackIcon /></IconButton>}
                    {!this.state.otpShow ? <h3>Enter your Phone Number</h3> : <h3>Enter the OTP</h3>}
                    <div>
                        {!this.state.otpShow ? <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 'auto', justifyContent: 'space-around' }}>
                            <div style={{ alignItems: 'flex-end', justifyContent: 'center', display: 'flex', marginRight: 10, width: 60 }}>
                                <TextField id="code" label="Code" color="secondary" value={this.state.code} onChange={e => {
                                    this.setState({ code: e.target.value });
                                }} />
                            </div>
                            <div>
                                <TextField id="phone" label="Phone" color="secondary" value={this.state.pno}
                                    onChange={e => {
                                        if ((e.target.value[e.target.value.length - 1] >= '0' && e.target.value[e.target.value.length - 1] <= '9') || !e.target.value) {
                                            this.setState({ pno: e.target.value });
                                        }
                                    }} />
                            </div>
                        </div> : <Otp otp={this.state.otp} setOtp={val => this.setState({ otp: val })} />}
                        {this.state.otpShow ? <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 5 }}>
                            Didn't receive an OTP? <Button onClick={() => this._getCode()} color="primary" style={{ textTransform: 'none', fontSize: 15 }}>Resend OTP</Button>
                        </div> : null}
                        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
                            <Button
                                variant="contained"
                                disabled={(this.state.pno.length !== 10) || (this.state.code === null) || !isNumeric(this.state.pno) || (this.state.otpShow && this.state.otp.length !== 6)}
                                color="secondary"
                                style={{
                                    color: 'white',
                                    marginLeft: 'auto',
                                    textTransform: 'none'
                                }}
                                onClick={() => {
                                    if (this.state.otpShow) {
                                        this._verifyCode();
                                    } else {
                                        this._getCode();
                                        this.setState({ otpShow: true });
                                    }
                                }}>
                                Submit
                            </Button>
                        </div>

                    </div>
                </Paper>
            </div>
        );
    }
}