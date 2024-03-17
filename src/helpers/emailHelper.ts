export class EmailHelper{
    config = {
        noreply : "bulkindexer@gmail.com",
        mailJetAPIPublicKey : "a9476a822deb7bc1526775cc0e67781c",
        mailJetAPIPrivateKey : "747326f848ac5cf529efabd5d07f4412",
        frontend : "https://example.com"
    }
    async sendEmail(msg:any){
        try{
            const mailjet = require ('node-mailjet').apiConnect(this.config.mailJetAPIPublicKey, this.config.mailJetAPIPrivateKey);
            let response = await mailjet.post("send", {'version': 'v3.1'})
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": msg.fromEmail,
                            "Name": msg.fromName
                        },
                        "To": [
                            {
                                "Email": msg.toEmail,
                            }
                        ],
                        "Subject": msg.subject,
                        "TextPart": msg.text,
                        "HTMLPart": msg.html
                    }
                ]
            })
            console.log("Mail Sent");
            return true;
        }catch(error){
            console.error(error.response.body);
            throw new Error("something went wrong while sending email");
        }
    }

    setEmailParams (toEmail, fromEmail, fromName, subject, html, text="Hello"){
        return {
          toEmail,
          fromEmail : fromEmail || this.config.noreply,
          fromName,
          subject,
          text,
          html
        };
    }
    
    async sendVerificationEmail(name : string,email : string,token:string){
        const verificationLink = `<a href=${this.config.frontend}/auth/verify-email?token=${token}>Verify Email</a>`
        let template = `Hi ${name},<br>
        <br>
        Thanks for signing up to Likairo! Before we get started, we just need to confirm this is you.<br>
        <br>
        Please click here to verify your email address: ${verificationLink}
        <br><br>
        Thanks!<br>
        Likairo Team`
      const subject = `Verify your email`;
      const fromEmail = "bulkindexer@gmail.com";
      const fromName = "Likairo Team";
      let params = this.setEmailParams(email, fromEmail, fromName, subject, template);
      await this.sendEmail(params);
      return true;
    }

    async resetPasswordEmail(name : string,email : string,token:string){
        const verificationLink = `<a href=${this.config.frontend}/auth/reset-password?token=${token}>Reset Password</a>`
        let template = `Hi ${name},<br>
        <br>
        Please click here to reset you password : ${verificationLink}
        <br><br>
        Thanks!<br>
        Likairo Team`
      const subject = `Reset Password`;
      const fromEmail = "bulkindexer@gmail.com";
      const fromName = "Likairo Team";
      let params = this.setEmailParams(email, fromEmail, fromName, subject, template);
      await this.sendEmail(params);
      return true;
    }
}