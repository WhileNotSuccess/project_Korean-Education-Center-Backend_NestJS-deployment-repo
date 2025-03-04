export const signUpEmailText = (language: string, url: string) => {
  if (language === 'korean') {
    return {
      subject: '가입 인증 메일',
      html: `<table style="border-collapse: collapse; width: 68.2277%; height: 497.844px; border-width: 0px; border-color: rgb(0, 0, 0); background-color: rgb(245, 245, 245);" border="1"><colgroup><col style="width: 15%;"><col style="width: 59.8383%;"><col style="width: 15%;"></colgroup>
  <tbody>
  <tr style="height: 95.7812px;">
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); border-width: 0px;">
  <p>&nbsp;</p>
  <p><img style="display: block; margin-left: auto; margin-right: auto;" src="cid:yju-logo" alt="" width="236" height="51"></p>
  </td>
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 237.719px;">
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); border-width: 0px;">
  <p style="text-align: center;"><strong><span style="font-size: 24pt;"><span style="color: rgb(53, 152, 219);">메일인증</span> 안내입니다.</span></strong></p>
  <p style="text-align: center;">&nbsp;</p>
  <p style="text-align: center;"><span style="font-size: 14pt;">안녕하세요.</span></p>
  <p style="text-align: center;"><span style="font-size: 14pt;">영진전문대학교 한국어교육센터에 가입해주셔서</span></p>
  <p style="text-align: center;"><span style="font-size: 14pt;">진심으로 감사드립니다.</span></p>
  <p style="text-align: center;"><span style="font-size: 14pt;">아래<strong> <span style="color: rgb(53, 152, 219);">'메일 인증'</span></strong> 버튼을 클릭하여 회원가입을 완료해 주세요.</span></p>
  </td>
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 46.375px;">
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); text-align: center; border-width: 0px;"><div style="display : flex; justify-content: center;"><a href=${url} style="text-decoration-line: none; text-align: center;" ><div style="border: 1px solid black; width:150px; background-color:rgb(53, 152, 219); padding: 5% 1%; color:white; border-radius:10px; text-align:center; align-items:center; font-size:14pt; font-weight:bold;">메일 인증</div></a></div></td>
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 84.1719px;">
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); border-width: 0px;"><hr>
  <p><span style="font-size: 10pt; color: rgb(206, 212, 217);">만약 버튼이 정상적으로 클릭되지 않는다면, 아래 링크를 복사하여 접속해주세요.</span></p>
  <span style="color: rgb(206, 212, 217); font-size: 10pt;">${url}</span></td>
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 33.7969px;">
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  </tr>
  </tbody>
  </table>`,
    };
  }
  if (language === 'english') {
    return {
      subject: 'Subscription verification email',
      html: `<table style="border-collapse: collapse; width: 68.2277%; height: 497.844px; border-width: 0px; border-color: rgb(0, 0, 0); background-color: rgb(245, 245, 245);" border="1"><colgroup><col style="width: 15%;"><col style="width: 59.8383%;"><col style="width: 15%;"></colgroup>
  <tbody>
  <tr style="height: 95.7812px;">
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); border-width: 0px;">
  <p>&nbsp;</p>
  <p><img style="display: block; margin-left: auto; margin-right: auto;" src="cid:yju-logo" alt="" width="236" height="51"></p>
  </td>
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 237.719px;">
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); border-width: 0px;">
  <p style="text-align: center;"><strong><span style="font-size: 24pt;"><span style="color: rgb(53, 152, 219);">Mail Verification</span> Notice</span></strong></p>
  <p style="text-align: center;">&nbsp;</p>
  <p style="text-align: center;"><span style="font-size: 14pt;">Hello</span></p>
  <p style="text-align: center;"><span style="font-size: 14pt;">Thank you sincerely for signing up for Yeungjin University Korean Education Center.</span></p>
  
  <p style="text-align: center;"><span style="font-size: 14pt;">Please complete your registration by clicking the<strong> <span style="color: rgb(53, 152, 219);">'Mail Verification'</span></strong> button below.</span></p>
  </td>
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 46.375px;">
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); text-align: center; border-width: 0px;"><div style="display : flex; justify-content: center;"><a href=${url} style="text-decoration-line: none; text-align: center;" ><div style="border: 1px solid black; width:150px; background-color:rgb(53, 152, 219); padding: 5% 1%; color:white; border-radius:10px; text-align:center; align-items:center; font-size:14pt; font-weight:bold;">Mail Verification</div></a></div></td>
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 84.1719px;">
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); border-width: 0px;"><hr>
  <p><span style="font-size: 10pt; color: rgb(206, 212, 217);">If the button does not work properly, please copy and paste the link below into your browser.</span></p>
  <span style="color: rgb(206, 212, 217); font-size: 10pt;">${url}</span></td>
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 33.7969px;">
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  </tr>
  </tbody>
  </table>`,
    };
  }
  if (language === 'chinese') {
    return {
      subject: '订阅验证电子邮件',
      html: `<table style="border-collapse: collapse; width: 68.2277%; height: 497.844px; border-width: 0px; border-color: rgb(0, 0, 0); background-color: rgb(245, 245, 245);" border="1"><colgroup><col style="width: 15%;"><col style="width: 59.8383%;"><col style="width: 15%;"></colgroup>
  <tbody>
  <tr style="height: 95.7812px;">
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); border-width: 0px;">
  <p>&nbsp;</p>
  <p><img style="display: block; margin-left: auto; margin-right: auto;" src="cid:yju-logo" alt="" width="236" height="51"></p>
  </td>
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 237.719px;">
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); border-width: 0px;">
  <p style="text-align: center;"><strong><span style="font-size: 24pt;">这是<span style="color: rgb(53, 152, 219);">邮件认证</span>的通知</span></strong></p>
  <p style="text-align: center;">&nbsp;</p>
  <p style="text-align: center;"><span style="font-size: 14pt;">您好</span></p>
  <p style="text-align: center;"><span style="font-size: 14pt;">T感谢您注册 Yeungjin University Korean Education Center</span></p>
  
  <p style="text-align: center;"><span style="font-size: 14pt;">请点击下方的<strong> <span style="color: rgb(53, 152, 219);">“邮件认证”</span></strong>按钮以完成会员注册</span></p>
  </td>
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 46.375px;">
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); text-align: center; border-width: 0px;"><div style="display : flex; justify-content: center;"><a href=${url} style="text-decoration-line: none; text-align: center;" ><div style="border: 1px solid black; width:150px; background-color:rgb(53, 152, 219); padding: 5% 1%; color:white; border-radius:10px; text-align:center; align-items:center; font-size:14pt; font-weight:bold;">邮件认证</div></a></div></td>
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 84.1719px;">
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); border-width: 0px;"><hr>
  <p><span style="font-size: 10pt; color: rgb(206, 212, 217);">如果按钮无法正常点击，请复制下面的链接并访问。</span></p>
  <span style="color: rgb(206, 212, 217); font-size: 10pt;">${url}</span></td>
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 33.7969px;">
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  </tr>
  </tbody>
  </table>`,
    };
  }
  if (language === 'japanese') {
    return {
      subject: '会員登録確認メール',
      html: `<table style="border-collapse: collapse; width: 68.2277%; height: 497.844px; border-width: 0px; border-color: rgb(0, 0, 0); background-color: rgb(245, 245, 245);" border="1"><colgroup><col style="width: 15%;"><col style="width: 59.8383%;"><col style="width: 15%;"></colgroup>
  <tbody>
  <tr style="height: 95.7812px;">
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); border-width: 0px;">
  <p>&nbsp;</p>
  <p><img style="display: block; margin-left: auto; margin-right: auto;" src="cid:yju-logo" alt="" width="236" height="51"></p>
  </td>
  <td style="height: 95.7812px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 237.719px;">
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); border-width: 0px;">
  <p style="text-align: center;"><strong><span style="font-size: 24pt;"><span style="color: rgb(53, 152, 219);">メール認証</span> のご案内です。</span></strong></p>
  <p style="text-align: center;">&nbsp;</p>
  <p style="text-align: center;"><span style="font-size: 14pt;">こんにちは。</span></p>
  <p style="text-align: center;"><span style="font-size: 14pt;">永進専門大学 韓国語教育センターにご登録いただき、</span></p>
  <p style="text-align: center;"><span style="font-size: 14pt;">心より感謝申し上げます。</span></p>
  <p style="text-align: center;"><span style="font-size: 14pt;">下記の<strong> <span style="color: rgb(53, 152, 219);">「メール認証」</span></strong> ボタンをクリックして、会員登録を完了してください。</span></p>
  </td>
  <td style="height: 237.719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 46.375px;">
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); text-align: center; border-width: 0px;"><div style="display : flex; justify-content: center;"><a href=${url} style="text-decoration-line: none; text-align: center;" ><div style="border: 1px solid black; width:150px; background-color:rgb(53, 152, 219); padding: 5% 1%; color:white; border-radius:10px; text-align:center; align-items:center; font-size:14pt; font-weight:bold;">メール認証</div></a></div></td>
  <td style="height: 46.375px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 84.1719px;">
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); border-width: 0px;"><hr>
  <p><span style="font-size: 10pt; color: rgb(206, 212, 217);">もしボタンが正常にクリックできない場合は、下記のリンクをコピーしてアクセスしてください。</span></p>
  <span style="color: rgb(206, 212, 217); font-size: 10pt;">${url}</span></td>
  <td style="height: 84.1719px; border-color: rgb(0, 0, 0); border-width: 0px;">&nbsp;</td>
  </tr>
  <tr style="height: 33.7969px;">
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  <td style="border-color: rgb(0, 0, 0); height: 33.7969px; border-width: 0px;">&nbsp;</td>
  </tr>
  </tbody>
  </table>`,
    };
  }
};
