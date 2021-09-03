# 리액트 라우터로 SPA 개발하기

## 13.1 SPA

- spa : 한개의 페이지로 이루어진 애플리케이션
- 라우팅 : 다른 주소에 다른 화면을 보여 주는 것

### 13.1.1 SPA의 단점

- 앱의 규모가 커지면 자바스크립트 파일이 너무 커진다<br> -> 코드 스플리팅을 사용하면 라우트별로 파일들을 나누어서 트래픽과 로딩 속도 개선 가능
- 자바스크립트가 실행되는 짧은 시간 동안 흰 페이지가 나타날 수 있음 <br>-> 서버 사이드 렌더링을 통해 해결 가능

## 13.2 프로젝트 준비 및 기본적인 사용법

- BrowserRouter 컴포넌트는 웹 어플리케이션에 HTML5의 History API를 사용하여 페이지를 새로고침하지 않고도 주소를 변경하고, 현재 주소에 관련된 정보를 props로 조회, 사용 할 수 있게 해준다.

```js
src / index.js;

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
```

```js
Home.js;
import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>
        <p> 홈, 그 페이지는 가장 먼저 보여지는 페이지</p>
      </h1>
    </div>
  );
};

export default Home;
```

```js
About.js;

import React from 'react';

const About = () => {
  return (
    <div>
      <h1>소개</h1>
      <p>이 프로젝트는 라우터 기초를 실습하는 예제</p>
    </div>
  );
};

export default About;
```

### 13.2.1 Route 컴포넌트로 특정 주소에 컴포넌트 연결

```js
예시

<Route path="주소규칙" component={보여줄 컴포넌트}/>
```

- /about 경로에는 두 컴포넌트가 모두 나타나는데 /about 경로가 / 규칙에도 일치하기 때문에 발생함 <br>
  -> Home을 위한 Route 컴포넌트를 사용할 때 exact props를 true로 설정

```js
App.js;

import React from 'react';
import { Route } from 'react-router';
import About from './About';
import Home from './Home';

const App = () => {
  return (
    <div>
      <Route path="/" component={Home} /> //exact={true} 추가
      <Route path="/about" component={About} />
    </div>
  );
};

export default App;
```

### 13.2.2 Link 컴포넌트를 사용하여 다른 주소로 이동하기

- Link 컴포넌트는 클릭 시 다른 주소로 이동시켜 주는 컴포넌트
- Link 컴포넌트 자체는 a 태그로 이루어져있지만, 페이지 전환을 방지하는 기능이 내장

```js

예시

<Link to="주소">내용</Link>
```

```js
App.js;

import React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import About from './About';
import Home from './Home';

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/about">소개</Link>
        </li>
      </ul>
      <Route path="/" component={Home} exact={true} />
      <Route path="/about" component={About} />
    </div>
  );
};

export default App;
```

## 13.3 Route 하나에 여러 개의 path 설정하기

```js
App.js;

import React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import About from './About';
import Home from './Home';

const App = () => {
  return (
    <div>
      <Route path="/" component={Home} exact={true} />
      <Route path={['/about', '/info']} component={About} />
    </div>
  );
};

export default App;
```

## 13.4 URL 파라미터와 쿼리

### 13.4.1 URL 파라미터

- profile/veloprt와 같은 형식으로 뒷부분에 유동적인 값을 props로 받아와 조회하는 방법

```js
Profile.js;

import React from 'react';

const data = {
  velopert: {
    name: '김민준',
    description: '리액트를 좋아하는 개발자',
  },
  gildong: {
    name: '홍길동',
    description: '고전 소설 주인공',
  },
};

const Profile = ({ match }) => {
  const { username } = match.params; // URL 파라미터를 사용할 때는 라우트로 사용되는 컴포넌트에서 match 라는 객체 안의 param 값을 참조, match 객체 안에는 현재 컴포넌트가 어떤 경로 규칙에 의해 보이는지에 대한 정보가 있음
  const profile = data[username];
  if (!profile) {
    return <div>존재하지 않는 사용자</div>;
  }
  return (
    <div>
      <h3>
        {username}({profile.name})
      </h3>
      <p>{profile.description}</p>
    </div>
  );
};

export default Profile;
```

```js
App.js;

import React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import About from './About';
import Home from './Home';
import Profile from './Profile';

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/about">소개</Link>
        </li>
        <li>
          <Link to="/profile/velopert">velopert프로</Link>
        </li>
        <li>
          <Link to="/profile/gildong">gildong프로</Link>
        </li>
      </ul>
      <hr />
      <Route path="/" component={Home} exact={true} />
      <Route path={['/about', '/info']} component={About} />
      <Route path="/profile/:username" component={Profile} />
    </div>
  );
};

export default App;
```

### 13.4.2 URL 쿼리

- 쿼리는 location 객체에 들어 있는 search 값에서 조회
- location 객체는 라우트로 사용된 컴포넌트에게 props로 전달되며, 웹 어플리케이션의 현재 주소에 대한 정보를 가지고 있다.

```js
location 형태

{
    "pathname":"/about",
    "search": "?detail=true", //url 쿼리를 읽을 때는 객체 중 search 값을 확인, 이 값은 문자열 형태
    "hash":""
    // http://localhost:3000/about?detail=true
}
```

-> search 값에서 특정 값을 읽어 오기 위해서는 문자열을 객체 형태로 변환해야 하는데 이 때 qs라는 라이브러리를 사용한다.

```js
About.js;

import qs from 'qs';
import React from 'react';

const About = ({ location }) => {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true, // 이 설정을 통해 문자열 맨 앞의 ?를 생략
  });
  const showDetail = query.detail === 'true'; // 쿼리의 파싱 결과 값은 문자열
  console.log(showDetail);
  return (
    <div>
      <h1>소개</h1>
      <p>이 프로젝트는 라우터 기초를 실습하는 예제</p>
      {showDetail && <p>detail 값을 true로 설정하셨군요!</p>}
    </div>
  );
};

export default About;
```

- 쿼리 문자열을 객체로 파싱하는 과정에서 결과 값은 문자열이다

## 13.5 서브 라우트

- 서브라우트 : 라우트 내부에 또 라우트를 정의 하는 것
- 라우트로 사용되고 있는 컴포넌트의 내부에 Route 컴포넌트를 또 사용하면 된다

```js
Profiles.js;

import React from 'react';
import { Link, Route } from 'react-router-dom';
import Profile from './Profile';

const Profiles = () => {
  return (
    <div>
      <h3>사용자 목록:</h3>
      <ul>
        <li>
          <Link to="/profiles/velopert">velopert</Link>
        </li>
        <li>
          <Link to="/profiles/gildong">gildong</Link>
        </li>
      </ul>

      <Route
        path="/profiles"
        exact // JSX 에서 props 설정할 때 값을 생략하면 자동으로 true로 설정
        render={() => <div> 사용자를 선택해 주세요.</div>} // 컴포넌트 자체가 아닌 JSX를 넣어 줄 수도 있다
      />
      <Route path="/profiles/:username" component={Profile} />
    </div>
  );
};

export default Profiles;
```

```js
App.js;

import React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import About from './About';
import Home from './Home';
import Profile from './Profile';
import Profiles from './Profiles';

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/about">소개</Link>
        </li>
        <li>
          <Link to="/profiles">프로필</Link>
        </li>
      </ul>
      <hr />
      <Route path="/" component={Home} exact={true} />
      <Route path={['/about', '/info']} component={About} />
      <Route path="/profiles" component={Profiles} />
    </div>
  );
};

export default App;
```

## 13.6 리액트 라우터 부가 기능

### 13.6.1 history

- history 객체는 라우트로 사용된 컴포넌트에 match, location과 함께 전달되는 props 중 하나로 컴포넌트 내에 구현하는 메서드에서 라우터 api를 호출할 수 있다

```js
HistorySamle.js;

import React, { Component } from 'react';

class HistorySample extends Component {
  //뒤로 가기
  handleGoBack = () => {
    this.props.history.goBack();
  };

  //홈으로 이동
  handleGoHome = () => {
    this.props.history.push('/');
  };

  componentDidMount() {
    //이것을 설정하고 나면 페이지에 변화가 생기려고 할 때마다 나갈 것인지 질문
    this.unblock = this.props.history.block('나가실 건가요?');
  }

  componentWillUnmount() {
    //컴포넌트가 언마운트되면 질문을 멈춤
    if (this.unblock) {
      this.unblock();
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.handleGoBack}>뒤로</button>
        <button onClick={this.handleGoHome}>앞으로</button>
      </div>
    );
  }
}

export default HistorySample;
```

```js
App.js;

import React from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import About from './About';
import HistorySample from './HistorySample';
import Home from './Home';
import Profile from './Profile';
import Profiles from './Profiles';

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/about">소개</Link>
        </li>
        <li>
          <Link to="/profiles">프로필</Link>
        </li>
        <li>
          <Link to="/history">히스토리 예제</Link>
        </li>
      </ul>
      <hr />
      <Route path="/" component={Home} exact={true} />
      <Route path={['/about', '/info']} component={About} />
      <Route path="/profiles" component={Profiles} />
      <Route path="/history" component={HistorySample} />
    </div>
  );
};

export default App;
```

### 13.6.2 withRouter

- withRouter 함수는 HOC(Higher-order Component)로 라우트로 사용된 컴포넌트가 아니어도 match, location, history 객체를 접근할 수 있게 해준다.

```js
WithRouterSample.js;

import React from 'react';
import { withRouter } from 'react-router-dom';
const WithRouterSample = ({ location, match, history }) => {
  return (
    <div>
      <h4>location</h4>
      <textarea
        value={JSON.stringify(location, null, 2)}
        rows={7}
        readOnly={true}
      />
      <h4>match</h4>
      <textarea
        value={JSON.stringify(match, null, 2)}
        rows={7}
        readOnly={true}
      />
      <button onClick={() => history.push('/')}>홈으로</button>
    </div>
  );
};

export default withRouter(WithRouterSample);
```

```js
Profiles.js;

import React from 'react';
import { Link, Route } from 'react-router-dom';
import Profile from './Profile';
import WithRouterSample from './WithRouterSample';

const Profiles = () => {
  return (
    <div>
      <h3>사용자 목록:</h3>
      <ul>
        <li>
          <Link to="/profiles/velopert">velopert</Link>
        </li>
        <li>
          <Link to="/profiles/gildong">gildong</Link>
        </li>
      </ul>

      <Route
        path="/profiles"
        exact // JSX 에서 props 설정할 때 값을 생략하면 자동으로 true로 설정
        render={() => <div> 사용자를 선택해 주세요.</div>} // 컴포넌트 자체가 아닌 JSX를 넣어 줄 수도 있다
      />
      <Route path="/profiles/:username" component={Profile} />
      <WithRouterSample />
    </div>
  );
};

export default Profiles;
```

- match 객체 안의 params가 비어 있는데 withRouter는 현재 자신을 보여주고 있는 라우트 컴포넌트(Profiles)를 기준으로 match가 전달되기 때문에 Profile.js로 WithRouterSample 컴포넌트를 옮기면 url 파라미터가 제대로 보일 것이다

```js
Profile.js;

import React from 'react';
import WithRouterSample from './WithRouterSample';

const data = {
  velopert: {
    name: '김민준',
    description: '리액트를 좋아하는 개발자',
  },
  gildong: {
    name: '홍길동',
    description: '고전 소설 주인공',
  },
};

const Profile = ({ match }) => {
  const { username } = match.params;
  const profile = data[username];
  if (!profile) {
    return <div>존재하지 않는 사용자</div>;
  }
  return (
    <div>
      <h3>
        {username}({profile.name})
      </h3>
      <p>{profile.description}</p>
      <WithRouterSample />
    </div>
  );
};

export default Profile;
```

### 13.6.3 Switch

- Switch 컴포넌트는 여러 Route를 감싸 일치하는 단 하나의 라우트만을 렌더링 시킨다
- Not Found 페이지도 구현할 수 있다

```js
App.js;

import React from 'react';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import About from './About';
import HistorySample from './HistorySample';
import Home from './Home';
import Profile from './Profile';
import Profiles from './Profiles';

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/about">소개</Link>
        </li>
        <li>
          <Link to="/profiles">프로필</Link>
        </li>
        <li>
          <Link to="/history">히스토리 예제</Link>
        </li>
      </ul>
      <hr />
      <Switch>
        <Route path="/" component={Home} exact={true} />
        <Route path={['/about', '/info']} component={About} />
        <Route path="/profiles" component={Profiles} />
        <Route path="/history" component={HistorySample} />
        <Route
          // path를 따로 정의하지 않으면 모듣 상황에 렌더링 됨
          render={({ location }) => (
            <div>
              <h2>이 페이지는 존재하지 않습니다</h2>
              <p>{location.pathname}</p>
            </div>
          )}
        />
      </Switch>
    </div>
  );
};

export default App;
```

- path에 정의되지 않는 url은 오류 페이지로 감

### 13.6.4 NavLink

- 현재 경로와 Link에서 사용하는 경로가 일치하는 경우 특정 스타일, css 클래스를 적용할 수 있는 컴포넌트( 스타일을 적용할 때는 activeStyle 값, css 클래스를 적용할 때는 activeClassName 값을 props로 넣어 주면 된다)

```js
Profiles.js;

import React from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import Profile from './Profile';
import WithRouterSample from './WithRouterSample';

const Profiles = () => {
  const activeStyle = {
    background: 'black',
    color: 'white',
  };

  return (
    <div>
      <h3>사용자 목록:</h3>
      <ul>
        <li>
          <NavLink activeStyle={activeStyle} to="/profiles/velopert">
            velopert
          </NavLink>
        </li>
        <li>
          <NavLink activeStyle={activeStyle} to="/profiles/gildong">
            gildong
          </NavLink>
        </li>
      </ul>

      <Route
        path="/profiles"
        exact // JSX 에서 props 설정할 때 값을 생략하면 자동으로 true로 설정
        render={() => <div> 사용자를 선택해 주세요.</div>} // 컴포넌트 자체가 아닌 JSX를 넣어 줄 수도 있다
      />
      <Route path="/profiles/:username" component={Profile} />
    </div>
  );
};

export default Profiles;
```
