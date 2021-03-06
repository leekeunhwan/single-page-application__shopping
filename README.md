# FDS 9 기 중간 프로젝트

결과물 보기

[https://moong2-spa-shopping-mall.netlify.com]

---

이근환, 2018. 05. 28 ~ 06. 01

## 중간 프로젝트 소개 및 목표

저는 쇼핑몰이라는 주제를 택했고,<br>

사용 기술로는<br>

- HTML
- CSS
- JavaScript
- Axios
- Material Css

를 사용하였습니다.<br>

초기 기획은 하나의 페이지에 다단형식으로 기능들을 더해 초기 렌더링 한번이면 모든 것이 끝나는 SPA 를 기획하였습니다.<br>

## 사실 (Fact)

초기 목표처럼 하려고 하였으나, 수업때 배운 방식과는 상이한 형태이기에 수업 취지에 맞게 배운 것을 쓰기 위해<br>
일반 쇼핑몰이나 HTML 과 JS 가 하나로 끝나는 SPA 사이트를 만들게 되었습니다.<br>
프로젝트는 원래 결제 기능과 사이버머니형식으로 충전하는 기능을 더 넣으려고 했는데<br>
생각보다 개발과정에 있어서 다양한 이슈들이 발생했고, 이슈를 잡다보니 목표한 만큼 100%는 다 하지 못했습니다.<br>
하지만 명세서로 주셨던 기능들과 추가적으로 사용자 경험을 좋게 할 수 있는 장치들을 다양하게 구현하였습니다.<br>
<br>

개발을 하면서 발생했던 이슈중 기억나는 3 가지는<br>

1.  결제 과정에 있어서 배송 주소와 요청 메세지를 상품명, 수량등과 같이 결제 확인 페이지에서 확인할 수 있게 보내줘야 하는데 중복으로 요청이 가서 애를 먹었던 것.<br>
    따로 따로 요청을 해서 생긴 문제였고, payload 에 데이터를 모아서 한 번에 보내는 방식으로 해결하였습니다.<br>

2.  axios 에서 users 와 같은 header(?)를 날릴 수 없었던 것을 모르고, 어떻게든 한번에 삭제 시키겠다고 애를 먹었었습니다.<br>
    추후에 그런 기능이 없음을 꺠달았고, 루프를 이용하여 하나씩 모두 삭제하는 방식으로 구현하였습니다.<br>

3.  코드가 길다보니 스코프 계산을 잘못하고 식을 작성하여 뜻대로 동작하지 않았던 경우가 있었습니다.<br>
    이런 현상을 줄이기 위해 주석을 달아가며 한줄 한줄씩 의미있게 작성하였고, 시간이 흐를수록 실수를 줄여 개발에 속도를 높일 수 있었습니다.<br>

<br>

## 긍정적인 변화와 느낀 점 (Feeling & Finding)

우선 가장 큰 긍정적인 변화는 성장을 느꼈고, 그로 인해 더욱 더 발전을 해나갈수 있는 추진력인 자신감과 성취감을 얻었습니다.<br>
수업시간에 배우긴 했지만 몸에 익혀두지 못했을 때는 내가 잘 배운건가라는 생각을 하고 조금은 불확실한 마음도 들었었는데,<br>
프로젝트를 진행하면서 수업시간에 배우지 못했던 기능도 스스로 찾아서 익히고 구현하는 제 자신을 보면서,<br>
수업만이 아니라 학원을 다니면서 스스로 익히고 얻어내는 능력도 생기고 점점 이런 부분이 향상되었음을 느낄수 있었습니다.<br>
<br>

프로젝트를 진행하면서 감정의 파도가 굉장히 컸었는데, 혼자서 하다보니 퀄리티의 목표는 자기자신에게 있었고,<br>
개인적으로 완벽함을 추구하는 성격이여서 기능을 보다 상세하게 구현하려다보니 애를 많이 먹었습니다.<br>
주제에 대한 원망(?)아닌 원망도 했고, axios 와 json-server 에서 지원해주지 않는 기능이 있어서<br>
그러한 부분을 스스로 해결해내야 하는 과정에서 많이 힘들기도 했었는데, 그래도 그러한 노력이 있기에<br>
어느정도 완성된 결과물을 보았을 때 입가에 미소가 맴도는 것 같습니다.<br>
힘들다가도 뭔가를 만들어 냈을때, 행복감을 얻을 수 있어서 좋았습니다.<br>
<br>

앞으로의 개인 프로젝트와 팀 프로젝트, 회사에서 프로젝트를 함에 있어서<br>
힘듦보다 만들고 났을 때의 그 짜릿함과 행복감이 더 기대되기에<br>
너무나도 벌써부터 설레입니다.<br>

<br>

## 개선할 점과 앞으로 해볼 일 (Future Action)

최종 프로젝트에도 쇼핑몰을 좀 더 개선해서 만든다면 실제 결제기능을 붙여보고 싶고,<br>
지금의 투박한 UI 가 아닌 UX 를 고려한 UI 로 만들어 보고 싶습니다.<br>
또한 검색기능, SNS 로 공유해갈 수 있는 기능, Kor/Eng 두 개의 언어 지원등..<br>
다양한 기능을 넣어서 실제로 사용해도 무리가 없도록 만들어 보고 싶습니다.<br>
<br>

앞으로 최종 프로젝트까지 남은 기간동안 React 공부에 전념할 계획이며,<br>
CSS 라이브러리도 다양하게 사용하면서 어떤 기능이 있는지 조금 더 알아볼 예정입니다.<br>
시간이 남는다면 이번에 쇼핑몰을 만드는 과정에서 몇몇 부분이 Meteor.js 의<br>
원리와 많이 비슷하다고 느꼈었는데 Meteor.js 도 다시한번 정리해볼 계획이 있습니다.<br>
잠시 주말간 간략히 휴식과 정리를 한후 또 계속 달려보도록 하겠습니다.<br>

<br>
