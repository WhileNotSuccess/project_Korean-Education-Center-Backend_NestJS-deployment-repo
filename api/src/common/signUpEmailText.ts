export const signUpEmailText = (language:string, url:string) => {
    if(language === 'korean'){
        return {
            subject:"가입 인증 메일",
            html:`<div><div>가입 확인을 누르시면 가입 인증이 완료됩니다.</div><a href=${url}>가입 확인</a></div>`
        }
    }
    if(language === 'english'){
        return {
            subject:"Subscription verification email",
            html:`<div><div>Click the subscription confirmation button to complete subscription verification.</div><a href=${url}>Confirm your subscription</a></div>`
        }
    }
    if(language === 'chinese'){
        return {
            subject:"订阅验证电子邮件",
            html:`<div><div>点击注册确认按钮，完成注册验证</div><a href=${url}>确认您的订阅</a></div>`
        }
    }
}

