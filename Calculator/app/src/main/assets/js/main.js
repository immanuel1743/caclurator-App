var today = new Date(),
      year = today.getFullYear(),
      month = today.getMonth() + 1,
      date = today.getDate(),
      getDate = `${year}년 ${month}월 ${date}일`,
      newRecord = {},
      getLocalRecord = localStorage.getItem("record"),
      getNewest = localStorage.getItem('newest'),
      isNewUser = localStorage.getItem('isNewUser'),
      resetBtn = document.querySelector('.reset_btn'),
      editBox = document.querySelector('.edit_box');
      
let calcInput = false,
    branch = null,
    orgRecord,
    newest;
    
var html = '';

document.addEventListener('DOMContentLoaded', function () {
  const splashBoard = document.querySelector('.splash'),
    addBtn = document.querySelector('.add_btn'),
    recordCons = document.querySelector('.record_cons'),
    sortList = document.querySelector('.sort_list'),
    sortBtn = document.querySelector('.sort_btn'),
    localRecord = localStorage.getItem('record'),
    isNewUser = localStorage.getItem('isNewUser'),
    newest = localStorage.getItem('newest');

  fadeIn(splashBoard);
  setBasicAcc();

  setTimeout(() => {
    fadeOut(splashBoard);
  }, "1500");

  if (!localRecord && !isNewUser) {
    orgRecord = [];
    onBoarding();
  } else {
    orgRecord = JSON.parse(localRecord);

    if (localRecord === '[]') showNonRecord();

    if (newest === 'false' || newest === null) {
      recordCons.classList.remove('active');
      sortList.children[0].classList.remove('active');
      sortList.children[0].innerHTML = '과거순';
    } else {
      if (newest !== 'false') {
        recordCons.classList.add('active');
        sortBtn.innerHTML = '최신순';
        sortBtn.classList.add('active');

        orgRecord = orgRecord.toReversed();
      } else {
        recordCons.classList.remove('active');
        sortBtn.innerHTML = '과거순';
      }
    }

    setRecordList();
    addBtn.style.display = 'flex';
  }
});

const onBoarding = () => {
  localStorage.setItem('isNewUser', true);
  localStorage.setItem('newest', false);
  localStorage.setItem('record', '[]');
  
  const sortList = document.querySelector('.sort_list'),
        recordList = document.querySelector('.record_list'),
        recordCons = document.querySelector('.record_cons'),
        addBtn = document.querySelector('.add_btn'),
        topInner = document.querySelector('.top_inner');
  
  html =
    `<div class='no_record'>
      <div class='no_comment'>
        <div class='main'>아래의 시작하기 버튼을 눌러 사용해 보세요</div>
        <div class='sub'>어쩌고저쩌고 부가 설명 넣고 설명설명설명.</div>
      </div>
      <div class="slide slide_wrap">
        <div class="slide_item">
          <img src="img/thumb_01.PNG" alt="계산기 화면">
        </div>
        <div class="slide_item">
          <img src="img/thumb_03.PNG" alt="계산기록 목록 화면">
        </div>
        <div class="slide_item">
          <img src="img/thumb_04.PNG" alt="계산기록 상세 화면">
        </div>
        <ul
          class="slide_pagination"
          role="button"
        ></ul>
      </div>
      <div class='calc_shorcut' onclick='showCalc()' role="button">시작하기</div>
    </div>`;

  sortList.style.display = 'none';
  addBtn.style.display = 'none';
  topInner.style.display = 'none';
  recordList.classList.add('visible');
  recordCons.classList.add('visible');
  recordCons.innerHTML = html;
  recordCons.classList.remove('active');
  
  includeJs('js/slider.js', 'sliderJs');
};

const setRecordList = (currentTabList, newest) => {
  html = "";
  document.querySelector('.sort_list').style.display = 'block',
  document.querySelector('.top_inner').style.display = 'block';
  document.querySelector('.record_list').classList.remove('visible');
  document.querySelector('.record_cons').classList.remove('visible');

  if (newest === true) orgRecord.reverse();
  branch = currentTabList !== undefined ? currentTabList : orgRecord;

  html = '';
  branch.forEach(function (record) {
    const getClassByType = (type) => {
      switch (type) {
        case '전세자금대출':
          return 'bg_1';
        case '부동산 중개보수':
          return 'bg_2';
        default:
          return 'bg_3';
      }
    };

  html += `
    <div class="record_box ${getClassByType(record.type)}" role="button" id="${record.id}">
      <div class="record_title aria-hidden" onclick="showRecordPopup('${record.id}')">
        ${record.title}
      </div>
      <div class="record_desc aria-hidden" onclick="showRecordPopup('${record.id}')">
        <div class="calc_type opacity font-size">계산 유형
          <div class="info" style="opacity: 1; font-weight: normal;">
            ${record.type}
          </div>
        </div>`;
    
if (record.type === "전세자금대출") {
  html += `
    <div class="principal opacity font-size">대출원금
      <div class="info" style="opacity: 1; font-weight: normal;">
        ${record.info1.toLocaleString('ko-KR')} 원
      </div>
    </div>
    <div class="interest opacity font-size">총 대출이자
      <div class="info" style="opacity: 1; font-weight: normal;">
        ${record.info6}
      </div>
    </div>
    <div class="Summation opacity font-size">총 상환금액
      <div class="info" style="opacity: 1; font-weight: normal;">
        ${record.info7}
      </div>
    </div>`;
} else if (record.type === "부동산 중개보수") {
  html += `
    <div class="principal opacity font-size">최대 중개보수
      <div class="info" style="opacity: 1; font-weight: normal;">
        ${record.info6}
      </div>
    </div>
    <div class="interest opacity font-size">협의 / 상한요율
      <div class="info" style="opacity: 1; font-weight: normal;">
        ${record.info7}
      </div>
    </div>
    <div class="Summation opacity font-size">거래금액
      <div class="info" style="opacity: 1; font-weight: normal;">
        ${record.info4} 원
      </div>
    </div>`;
} else {
  html += `
    <div class="calc_type opacity font-size">중도상환 수수료
      <div class="info" style="opacity: 1; font-weight: normal;">
        ${record.info6}
      </div>
    </div>
    </div>
  </div>
  </div>`;
}
  html += '</div></div>'

    document.querySelector('.record_cons').innerHTML = html;
    document.querySelector('.cate_btn.active').click();
  });

  setBasicAcc();
  document.querySelector('.add_btn').style.display = 'flex';
};

const saveRecord = () => {
  localStorage.setItem("record", JSON.stringify(orgRecord));
};

const deletRecord = (id) => {
  const getRecordBox = document.getElementById(JSON.stringify(id)),
        recordPopup = document.querySelector('.record_popup');

  animate(recordPopup, 'left', '100%');
  fadeOut(getRecordBox);

  orgRecord = orgRecord.filter((newRecord) => newRecord.id !== parseInt(id));
  saveRecord();

  if (document.querySelectorAll('.record_box').length === 1) showNonRecord();
};


const selectTerm = (e) => {
  const getType = e.innerHTML,
        getText = e.parentElement.nextElementSibling.querySelector('.change.mark'),
        getInput = e.parentElement.nextElementSibling.querySelector('input'),
        calcBtn = document.querySelector('.calc_btn'),
        getValue = getInput.value,
        fixValue = "";

  e.classList.add('active');
  e.setAttribute('onclick', 'calculating()');
  e.setAttribute('aria-selected', true);

  for (let sibling of e.parentNode.children) {
    if (sibling !== e) {
      sibling.classList.remove('active');
      sibling.setAttribute('aria-selected', false);
    }
  }

  calcBtn.innerHTML = '계산하기';
  calcBtn.style.display = 'flex';
  calcBtn.classList.remove = 'active';
  resetBtn.classList.remove = 'center';
  calcBtn.setAttribute('onclick', 'calculating()');
  sum.style.display = 'none';

  if (e.classList.contains('active')) {
    e.setAttribute('onclick', '');
    for (let sibling of e.parentNode.children) {
      if (sibling !== e) sibling.setAttribute('onclick', 'selectTerm(this)');
    }
  }

  if (getType === "년" || getType === "개월") {
    getText.innerHTML = getType;
    if (getType === "년") {
      getValue = getValue / 12;
      getInput.classList.remove('padding');
      getInput.setAttribute('maxlength', 2);
    } else {
      (getValue = getValue * 12), getInput.classList.add('padding');
      getInput.setAttribute('maxlength', 3)
    }
    fixValue = getValue.toFixed(0);
    if (fixValue !== "0") getInput.value = fixValue;
  }
};

const select = (e) => {
  const getType = e.innerHTML,
        tag = document.querySelector('.tag'),
        selectEl = document.querySelector('select'),
        nationwide = document.querySelector('.nationwide'),
        subTab = document.querySelector('.subtab');

  e.classList.add('active');
  e.setAttribute('aria-selected', true);
  for (let sibling of e.parentNode.children) {
    if (sibling !== e) {
      sibling.classList.remove('active');
      sibling.setAttribute('aria-selected', false);
    }
  }

  sum.style.display = 'none';
  // 중개보수 > 거래지역 막을 필요 있는지
  // const localSeoul = document.querySelector('option[value="서울시"]'),
  //       getOptions = document.querySelectorAll('option');

  if (e.classList.contains('active')) {
    calcBtn.innerHTML = '계산하기';
    calcBtn.setAttribute('onclick', 'calculating()');
  }

  if(getType === '주택') {
    tag.innerHTML = '주택의 부속토지, 주택분양권 포함';
    selectEl.removeAttribute('disabled');
    selectEl.setAttribute('aria-disabled', false);
    nationwide.style.display = 'none';
    nationwide.setAttribute('selected', false);
  }
  else if(getType === '오피스텔') {
    tag.innerHTML = '부엌화장실등의 시설을 갖춘 전용면적 85㎡ 이하 오피스텔';
    selectEl.setAttribute('disabled', true);
    selectEl.setAttribute('aria-disabled', true);
    nationwide.style.display = 'block';
    nationwide.setAttribute('selected', true);
  }
  else if(getType === '주택 외'){
    tag.innerHTML = '오피스텔(주거용 제외). 상가, 토지 등';
    selectEl.setAttribute('disabled', true);
    selectEl.setAttribute('aria-disabled', true);
    nationwide.style.display = 'block';
    nationwide.setAttribute('selected', true);
  }

  if (getType === '주택' || getType === '오피스텔' || getType === '주택 외') {
    subTab.classList.add('active');
     for (let sibling of subTab.parentNode.children) {
      if (sibling !== subTab) sibling.classList.remove('active');
     }
  }

  html = '';
  if(getType === '월세') {
  html =
      '<div class="step_monthly deposit">보증금\
        <input name="보증금" type="text" inputmode="numeric" pattern="[0-9]*" style="margin: 0 0 0 31px" onkeyup="addQuote(this)" onfocus="checkFocus()" maxlength="12" class="except">\
        <small class="mark">원</small>\
       </div>\
       <div class="step_monthly monthly">월세\
         <input name="월세" type="text" inputmode="numeric" pattern="[0-9]*" style="margin: 0 0 0 43px" onkeyup="addQuote(this)" onfocus="checkFocus()" maxlength="8" class="except">\
         <small class="mark">원</small>\
       </div>\
       <div class="step_third">협의보수율\
         <input name="협의보수율" type="text" id="interestRate" inputmode="numeric" onkeyup="addQuote(this)" onfocus="checkFocus()" maxlength="8" class="except">\
         <small class="mark">%</small>\
       </div>\
       <span class="notice">협의보수율을 입력하지 않거나, 상한요율보다 높으면 상한요율이 적용됩니다.</span>';
  } else if(getType === '전세') {
    html =
      '<div class="step_monthly deposit">보증금\
        <input name="보증금" type="text" inputmode="numeric" style="margin: 0 0 0 31px" onkeyup="addQuote(this)" onfocus="checkFocus()" maxlength="12" class="except">\
        <small class="mark">원</small>\
       </div>\
       <div class="step_third">협의보수율\
         <input name="협의보수율" type="text" id="interestRate" onkeyup="addQuote(this)" inputmode="numeric" onfocus="checkFocus()" maxlength="8" class="except">\
         <small class="mark">%</small>\
       </div>\
       <span class="notice">협의보수율을 입력하지 않거나, 상한요율보다 높으면 상한요율이 적용됩니다.</span>';
  } else {
    html =
      '<div class="step_one step_hide">거래금액\
        <input type="text" title="거래금액" name="거래금액" class="except" inputmode="numeric" onfocus="checkFocus()" maxlength="12" onkeyup="addQuote(this)"><small class="mark" onpaste="return false;">원</small>\
      </div>\
       <div class="step_third">협의보수율\
         <input title="협의보수율" name="협의보수율" type="text" id="interestRate" onkeyup="addQuote(this)" inputmode="numeric" onfocus="checkFocus()" maxlength="8" class="except">\
         <small class="mark">%</small>\
       </div>\
       <span class="notice">협의보수율을 입력하지 않거나, 상한요율보다 높으면 상한요율이 적용됩니다.</span>';
  }

  if (document.querySelector('.tab.active').innerHTML == '부동산 중개보수') {
    document.querySelector('.change_steps').innerHTML = html;
  }
};

const refreshInput = () => {
  const getAllInput = document.querySelectorAll("input:not(.edit_box)"),
        sum = document.querySelector('.sum'),
        calcBtn = document.querySelector('.calc_btn'),
        resetBtn = document.querySelector('.reset_btn');
              

  getAllInput.forEach(input => input.value = null);

  sum.style.display = 'none';
  calcBtn.classList.remove('active');
  calcBtn.style.display = 'flex';
  calcBtn.innerHTML = '계산하기';
  calcBtn.setAttribute('onclick', 'calculating()');
  resetBtn.classList.remove('center', 'active');
};

const showCalcDetail = (e) => {
  const getValue = e.innerHTML;

  e.setAttribute('aria-selected', true);
  if(e.classList.contains('active')) return;
  else {
    e.classList.add('active');
    if (getValue === "전세자금대출") setCharterHtml();
    else if (getValue === "중도상환 수수료") setRepaymentHtml();
    else setEstateHtml();
  }

  for (let sibling of e.parentNode.children) {
    if (sibling !== e) {
      sibling.classList.remove('active');
      sibling.setAttribute('aria-selected', false);
    }
  }

  checkFocus();
};

const setCharterHtml = () => {
  const calcBox = document.querySelector('.calc_box');
      
  html =
    '<div class="steps">\
    <div class="step_one">대출금액\
      <input title="대출금액" name="대출금액" type="text" pattern="[0-9]*" inputmode="numeric" maxlength="12" onfocus="checkFocus()" onkeyup="addQuote(this)"  onpaste="return false;"><small class="mark">원</small>\
      <div class="as_loan"></div>\
    </div>\
    <div class="step_two">대출기간\
      <div class="select_box">\
        <div class="year active" role="tab" aria-selected="true">년</div>\
        <div class="month" role="tab" aria-selected="false" onclick="selectTerm(this)">개월</div>\
      </div>\
      <div><input name="대출기간" type="text" class="change input" inputmode="numeric" maxlength="2" onfocus="checkFocus()"  onpaste="return false;"><small class="change mark">년</small></div>\
    </div>\
    <div class="step_third">연이자율\
      <input title="연이자율" name="연이자율" type="text" maxlength="2" inputmode="numeric" onfocus="checkFocus()"  onpaste="return false;">\
      <small class="mark">%</small>\
    </div>\
    <div class="step_four">상환방법\
      <div class="select_box repay_method">\
        <div class="select_one active" onclick="select(this)" role="tab" aria-selected="true">원리금균등</div>\
        <div class="select_two" onclick="select(this)" role="tab" aria-selected="false">원금균등</div>\
        <div class="select_third" onclick="select(this)" role="tab" aria-selected="false">만기일시</div>\
      </div>\
    </div>\
  </div>\
  <div class="space_bar"></div>\
  <div class="sum">\
  </div>';

  calcBox.innerHTML = html;
};

const setEstateHtml = () => {
html =
    '<div class="steps">\
    <div class="step_four property_tab">매물유형\
      <div class="select_box">\
        <div class="active" onclick="select(this)" role="tab" aria-selected="true">주택</div>\
        <div onclick="select(this)" role="tab" aria-selected="false">오피스텔</div>\
        <div onclick="select(this)" role="tab" aria-selected="false">주택 외</div>\
        <small></small>\
      </div>\
    </div>\
    <span class="notice tag">주택의 부속토지, 주택분양권 포함</span>\
    <div class="step_four">거래지역\
      <div class="select_box">\
        <select onfocus="checkFocus()">\
          <option value="서울시">서울시</option>\
          <option value="경기도">경기도</option>\
          <option value="인천시">인천시</option>\
          <option value="부산시">부산시</option>\
          <option value="대구시">대구시</option>\
          <option value="울산시">울산시</option>\
          <option value="세종시">세종시</option>\
          <option value="광주시">광주시</option>\
          <option value="강원도">강원도</option>\
          <option value="충청북도">충청북도</option>\
          <option value="충청남도">충청남도</option>\
          <option value="경상북도">경상북도</option>\
          <option value="경상남도">경상남도</option>\
          <option value="전라북도">전라북도</option>\
          <option value="전라남도">전라남도</option>\
          <option value="제주도">제주도</option>\
          <option value="전국" class="nationwide">전국</option>\
        </select>\
      </div>\
    </div>\
    <div class="step_four trans_tab">거래유형\
      <div class="select_box">\
        <div class="subtab active" onclick="select(this)" role="tab" aria-selected="true">매매/교환</div>\
        <div onclick="select(this)" role="tab" aria-selected="false">전세</div>\
        <div onclick="select(this)" role="tab" aria-selected="false">월세</div>\
      </div>\
    </div>\
    <section class="change_steps">\
      <div class="step_one step_hide">거래금액\
        <input name="거래금액" type="text" pattern="[0-9]*" class="except" inputmode="numeric" onfocus="checkFocus()" maxlength="12" onkeyup="addQuote(this)" onpaste="return false;"><small class="mark">원</small>\
      </div>\
      <div class="step_third">협의보수율\
        <input name="협의보수율" type="text" id="interestRate "onkeyup="addQuote(this)" inputmode="numeric" onfocus="checkFocus()" maxlength="8" class="except" onpaste="return false;">\
        <small class="mark">%</small>\
      </div>\
      <span class="notice">협의보수율을 입력하지 않거나, 상한요율보다 높으면 상한요율이 적용됩니다.</span>\
    </section>\
  </div>\
  <div class="space_bar"></div>\
  <div class="sum">\
  </div>';

  document.querySelector('.calc_box').innerHTML = html;
}

const setRepaymentHtml = () => {
  html =
    '<div class="steps">\
    <div class="step_one">상환금액\
      <input title="상환금액" name="상환금액" type="text" pattern="[0-9]*" inputmode="numeric" maxlength="12" onkeyup="addQuote(this)" onfocus="checkFocus()" onpaste="return false;"><small class="mark">원</small>\
    </div>\
    <div class="step_two">대출기간\
      <div class="select_box loan_select">\
        <div class="year active" role="tab" aria-selected="true">년</div>\
        <div class="month" onclick="selectTerm(this)" role="tab" aria-selected="false">개월</div>\
      </div>\
      <div><input title="대출기간" name="대출기간" type="text" inputmode="numeric" class="change input" onfocus="checkFocus()" maxlength="2" onpaste="return false;"><small class="change mark">년</small></div>\
    </div>\
    <div class="step_two">잔존기간\
      <div class="select_box remain_select">\
        <div class="year active" role="tab" aria-selected="true">년</div>\
        <div class="month" onclick="selectTerm(this)" role="tab" aria-selected="false">개월</div>\
      </div>\
      <div><input title="잔존기간" name="잔존기간" type="text" inputmode="numeric" class="change input" onfocus="checkFocus()" maxlength="2" onpaste="return false;"><small class="change mark">년</small></div>\
    </div>\
    <div class="step_third">수수료율\
      <input title=""수수료율 name="수수로율" type="text" inputmode="numeric" onfocus="checkFocus()" maxlength="3" onpaste="return false;">\
      <small class="mark">%</small>\
    </div>\
  </div>\
  <div class="space_bar"></div>\
  <div class="sum">\
  </div>';

  document.querySelector('.calc_box').innerHTML = html;
};

const saveRecordList = (newRecord) => {
  const resetBtn = document.querySelector('.reset_btn'),
        calcBtn = document.querySelector('.calc_btn'),
        editBox = document.querySelector('.edit_box'),
        newest = localStorage.getItem('newest');


  if (newest === 'true') orgRecord.unshift(newRecord);
  else orgRecord.push(newRecord);

  setRecordList();
  saveRecord();
  showToast('저장이 완료되었습니다');

  resetBtn.classList.add('center');
  calcBtn.style.display = 'none';
  editBox.setAttribute('readonly', false);
  editBox.setAttribute('onfocus', 'this.blur()');
  editBox.classList.remove('active');
  editBox.blur;
}

let upper = '';
const calculating = () => {
  const getCate = document.querySelectorAll(".tab"),
        getSteps = document.querySelectorAll("input:not(.edit_box)"),
        getTitle = document.querySelector('.edit_box'),
        calcBtn = document.querySelector('.calc_btn'),
        month = document.querySelector('.month'),
        sum = document.querySelector('.sum');

  if (getTitle.value === "") {
    showToast('제목을 입력해 주세요');
    getTitle.focus();
    return;
  };

  for (var i = 0; i < getCate.length; i++) {
    const getTabCate = document.querySelector('.tab.active').innerHTML;
    for (var i = 0; i < getSteps.length; i++) {
      const getStepType = getSteps[i].name,
      getStepVal = Number(getSteps[i].value);

      if (getStepVal === "" || getStepVal <= 0) {
        showToast(`${getStepType}를 입력해 주세요`);
        getSteps[i].focus();
        sum.style.display = 'none';
        return;
      } else {
        calcInput = true;
        sum.display = 'block';
        calcBtn.classList.add('active');
      }
      calcInput = true;
      sum.display = 'block';
      calcBtn.classList.add('active');

      if (month) {
        if(month.classList.contains('active')) {
          interestRate = interestRate / 12;
        }
      }
      

      if(getTabCate === '부동산 중개보수')  numPayments = '';
      else numPayments = (Number(getSteps[2].value) / 10) / 10;

      var loanAmount = Number(getSteps[0].value.replaceAll(',', '')),
          interestRate = Number(getSteps[1].value.replaceAll(',', '')),
          loanAmountCalc = loanAmount * numPayments,
          loanAmountSum = loanAmountCalc * interestRate,
          interestSum = loanAmount + loanAmountSum,
          monthCalc =  loanAmountCalc / 12,
          monthSum = monthCalc * interestRate,
          monthsInterest = loanAmount + monthSum;
          getSubTabCateElement = document.querySelector('.property_tab .select_box div.active'),
          getSubTabCate = getSubTabCateElement ? getSubTabCateElement.innerHTML : null,
          getThirdTabCateElement = document.querySelector('.trans_tab .select_box div.active'),
          getThirdTabCate = getThirdTabCateElement ? getThirdTabCateElement.innerHTML : null;
          rate = '';

          if(getSubTabCate === '주택') {
            if(getThirdTabCate === '매매/교환') {
              if(loanAmount < 50000000) rate = 0.6, upper = 'list_1';
              if(loanAmount >= 50000000 && loanAmount < 200000000) rate = 0.5, upper = 'list_2';
              if(loanAmount >= 200000000 && loanAmount < 900000000) rate = 0.4, upper = 'list_3';
              if(loanAmount >= 900000000 && loanAmount < 1200000000) rate = 0.5, upper = 'list_4';
              if(loanAmount >= 1200000000 && loanAmount < 1500000000) rate = 0.6, upper = 'list_5';
              if(loanAmount >= 1500000000) rate = 0.7, upper = 'list_6';
            } else if(getThirdTabCate === '전세') {
              if(loanAmount < 50000000) rate = 0.5, upper = 'list_1';
              if(loanAmount >= 50000000 && loanAmount < 100000000) rate = 0.4, upper = 'list_2';
              if(loanAmount >= 100000000 && loanAmount < 600000000) rate = 0.3, upper = 'list_3';
              if(loanAmount >= 600000000 && loanAmount < 1200000000) rate = 0.4, upper = 'list_4';
              if(loanAmount >= 1200000000 && loanAmount < 1500000000) rate = 0.5, upper = 'list_5';
              if(loanAmount >= 1500000000) rate = 0.6, upper = 'list_6';
            } else {
              var calcLoanAmount = loanAmount + (interestRate * 100);
              if(calcLoanAmount < 50000000) calcLoanAmount = loanAmount + (interestRate * 70);
              loanAmount = calcLoanAmount;

              if(loanAmount < 50000000) rate = 0.5, upper = 'list_1';
              if(loanAmount >= 50000000 && loanAmount < 100000000) rate = 0.4, upper = 'list_2';
              if(loanAmount >= 100000000 && loanAmount < 600000000) rate = 0.3, upper = 'list_3';
              if(loanAmount >= 600000000 && loanAmount < 1200000000) rate = 0.4, upper = 'list_4';
              if(loanAmount >= 1200000000 && loanAmount < 1500000000) rate = 0.5, upper = 'list_5';
              if(loanAmount >= 1500000000) rate = 0.6, upper = 'list_6';
            }
          } else if(getSubTabCate === '오피스텔') {
            rate = 0.4;

            if(getThirdTabCate === '매매/교환') rate = 0.5
            if(getThirdTabCate === '월세') {
              var calcLoanAmount = loanAmount + (interestRate * 100);
              if(calcLoanAmount < 50000000) calcLoanAmount = loanAmount + (interestRate * 70);
              loanAmount = calcLoanAmount;
            }
          } else {
            if(getThirdTabCate === '월세') {
              var calcLoanAmount = loanAmount + (interestRate * 100);
              if(calcLoanAmount < 50000000) calcLoanAmount = loanAmount + (interestRate * 70);
              loanAmount = calcLoanAmount;
            }
            rate = 0.9;
          }
      if (document.querySelector('#interestRate') != null) {
        var getLowRate = document.querySelector('#interestRate').value,
            calcLowRate = Number(getLowRate),
            rateNotice = rate.toString();

        if(calcLowRate < rate) rate = calcLowRate;
      }

      var brokerage = rate / 100,
          brokerageCalc = loanAmount * brokerage,
          brokerageSum = parseInt(brokerageCalc);
          brokerageSum = brokerageCalc,
          selectOne = document.querySelector('.select_one'),
          year = document.querySelector('.year');

      if (getTabCate === "전세자금대출") {
        var numPayments = Number(getSteps[2].value);
  
        if (selectOne.classList.contains('active')) {
          if(year.classList.contains('active')) interestRate = interestRate * 12;
          equalCalc = getSteps[2].value;
          
          var monthlyInterestRate = (equalCalc / 12) / 100;
              numerator = loanAmount * monthlyInterestRate * Math.pow((1 + monthlyInterestRate), interestRate);
              denominator = Math.pow((1 + monthlyInterestRate), interestRate) - 1;
              emi = numerator / denominator,
              emi = Math.round(emi),
              calcEqual = loanAmount * (getSteps[2].value / 100) / 12,
              calcEqual = Math.round(calcEqual),
              principal = emi - calcEqual,
              equalSum = loanAmount - principal,
              orgCalcEqual = calcEqual,
              orgEqualMonth = emi,
              monthlyList = document.querySelector('.monthly_list'),
              monthlyNotice = document.querySelector('.momthly_notice'),
              html = '';

          html =
            '<div>\
              <div>1</div>\
              <div>'+emi.toLocaleString('ko-KR')+'</div>\
              <div>'+equalSum.toLocaleString('ko-KR')+'</div>\
             </div>';

          monthlyList.innerHTML = html;

          var totalInterest = 0;
          for (let i = 2; i <= interestRate; i++) {
            calcEqual = equalSum * (getSteps[2].value / 100) / 12,
            principal = emi - calcEqual,
            equalSum = equalSum - principal,
            equalSum = Math.floor(equalSum);

            if(equalSum < 0) equalSum = 0;
            totalInterest += calcEqual + calcEqual;
            
            html +=
            '<div>\
              <div>'+i+'</div>\
              <div>'+emi.toLocaleString('ko-KR')+'</div>\
              <div>'+equalSum.toLocaleString('ko-KR')+'</div>\
             </div>';

          }
          monthlyList.innerHTML = html;
          monthlyNotice.innerHTML = '원리금균등';
          totalInterest = totalInterest / 2 + Math.round(orgCalcEqual);
          totalInterest = Math.round(totalInterest),
          calcSum = loanAmount + totalInterest,
          calcSum = Math.round(calcSum);

          html =
          '<div>대출원금<div class="sum_one">' +
          loanAmount.toLocaleString('ko-KR') +
          ' 원</div></div>\
            <div class="red">총 대출이자<div class="sum_two">' +
            totalInterest.toLocaleString('ko-KR') +
          ' 원</div></div>\
            <div>총 상환금액<div class="sum_thirds">' +
            calcSum.toLocaleString('ko-KR') +
          " 원</div></div>";
        }
        else if (document.querySelector('.select_two').classList.contains('active')) {
          if(document.querySelector('.year').classList.contains('active')) interestRate = interestRate * 12;

          var equaLoan = loanAmount / interestRate,
              equalCalc = ((getSteps[2].value / 100) / 12),
              calcEqual = loanAmount * equalCalc,
              equalMonth = equaLoan + calcEqual,
              equalSum = loanAmount - equalMonth + calcEqual,
              totalInterest = 0,
              orgCalcEqual = calcEqual,
              orgEqualMonth = equalMonth,
              monthlyList = document.querySelector('.monthly_list'),
              monthlyNotice = document.querySelector('.momthly_notice'),
              html = '';

          equaLoan = Math.round(equaLoan);
          calcEqual = Math.round(calcEqual);
          equalMonth = Math.floor(equalMonth);
          equalSum = Math.round(equalSum);
          orgEqualMonth = Math.round(orgEqualMonth);

          html =
            '<div>\
              <div>1</div>\
              <div>'+equalMonth.toLocaleString('ko-KR')+'</div>\
              <div>'+equalSum.toLocaleString('ko-KR')+'</div>\
             </div>';

          monthlyList.innerHTML = html;

          var equaLoan = loanAmount / interestRate,
              totalInterest = 0;

          for (let i = 2; i <= interestRate; i++) {
            equaLoan = equaLoan;
            calcEqual = equalSum * equalCalc;
            equalMonth = equaLoan + calcEqual;
            equalSum = equalSum - equalMonth + calcEqual;

            equaLoan = Math.round(equaLoan);
            calcEqual = Math.round(calcEqual);
            equalMonth = Math.floor(equalMonth);
            equalSum = Math.round(equalSum);

            if(equalSum < 0) equalSum = 0;
            totalInterest += calcEqual + calcEqual;

            html +=
            '<div>\
              <div>'+i+'</div>\
              <div>'+equalMonth.toLocaleString('ko-KR')+'</div>\
              <div>'+equalSum.toLocaleString('ko-KR')+'</div>\
             </div>';

        }
        monthlyList.innerHTML = html;
        monthlyNotice.innerHTML = '원금균등';

        totalInterest = totalInterest / 2 + Math.round(orgCalcEqual);
        calcSum = loanAmount + totalInterest;

        html =
          '<div>대출원금<div class="sum_one">' +
          loanAmount.toLocaleString('ko-KR') +
          ' 원</div></div>\
            <div class="red">총 대출이자<div class="sum_two">' +
            totalInterest.toLocaleString('ko-KR') +
          ' 원</div></div>\
            <div>총 상환금액<div class="sum_thirds">' +
            calcSum.toLocaleString('ko-KR') +
          " 원</div></div>";
        }
        else {
          loanAmountSum =  Math.floor(loanAmountSum),
          interestSum = Math.floor(interestSum);

          html =
            '<div>대출원금<div class="sum_one">' +
            getSteps[0].value +
            ' 원</div></div>';
            if(document.querySelector('.year').classList.contains('active')) {
              html +=
             '<div class="red">총 대출이자<div class="sum_two">' +
             loanAmountSum.toLocaleString('ko-KR') +
            ' 원</div></div>\
             <div>총 상환금액<div class="sum_thirds">' +
             interestSum.toLocaleString('ko-KR') +
            " 원</div></div>";
            } else {
              monthSum = Math.floor(monthSum),
              monthsInterest = Math.floor(monthsInterest);
              
              html +=
              '<div class="red">총 대출이자<div class="sum_two">' +
              monthSum.toLocaleString('ko-KR') +
             ' 원</div></div>\
              <div>총 상환금액<div class="sum_thirds">' +
              monthsInterest.toLocaleString('ko-KR') +
             " 원</div></div>";
            }
            html +=
            '<div class="notice">* 월단위로 계산된 이자이기 때문에 일단위로 계산되는 금융기관의 대출이자와는 차이가 있습니다.</div>'
        }
        if(!document.querySelector('.select_third').classList.contains('active')) {
          html += '<div class="space_bar"></div>';
          html +=
            '<div class="sum_info">1회차 상환금액<div>' +
            orgEqualMonth.toLocaleString('ko-KR') +
            " 원</div>\
            </div>\
            <span class='month_btn notice' role='button' onclick='showMonthly()'>월별 상환금액 더 보기<img src='img/right_arrow.svg'/></span>\
            <div class='notice'>* 월단위로 계산된 이자이기 때문에 일단위로 계산되는 금융기관의 대출 이자와는 차이가 있습니다.</div>";
        }
      } else if (getTabCate === "중도상환 수수료") {
        var getLoanVal = Number(document.querySelector('.loan_select').parentNode.children[1].querySelector('input').value),
            getLoanType = document.querySelector('.loan_select .active').innerHTML;
            getReminType = document.querySelector('.remain_select .active').innerHTML;
            CalcCharge = Number(getSteps[3].value) / 100,
            getRemainVal = Number(getSteps[2].value);

        CalcCharge.toFixed(2);
        
        if(getLoanType === '개월') getLoanVal = getLoanVal / 12;
        if(getReminType === '개월') getRemainVal = getRemainVal / 12;

        var chargeCalc = loanAmount * CalcCharge * (getRemainVal / getLoanVal),
            chargeCalc = Math.floor(chargeCalc);

        html =
          '<div>\
            <div class="red">중도상환 수수료</div>\
            <div class="vat_sum red">'+chargeCalc.toLocaleString('ko-KR')+' 원</div>\
           </div>\
           <span class="notice">정확한 수수료율은 대출 계약서를 확인하세요.</span>';
      }
      else {
        var getSval = document.querySelector('select').value;
        brokerageSum = Math.floor(brokerageSum);

        html =
          '<div>최대 중개보수<div class="sum_one red">'+brokerageSum.toLocaleString('ko-KR')+' 원</div></div>\
            <span class="notice">(VAT 별도)</span>\
           <div>협의 / 상한요율<div class="sum_two red">'+rate+' %</div></div>\
           <div>거래금액<div class="sum_thirds">'+loanAmount.toLocaleString('ko-KR')+' 원</div></div>\
           <span class="notice">중개보수는 [거래금액 X 상한효율] 범위 내에서 협의(단, 계산된 금액은 한도를 초과할 수 없습니다.)</span>';
           if(getSubTabCate === '오피스텔' || getSubTabCate === '주택 외') {
            html  +=
            '<div class="sum_notice notice"><div class="red">상한요율 '+rateNotice+'% 이내</div>에서 중개 의뢰인과 중개업자가 협의하여 결정</div>';
           }

        if(getSubTabCate === '주택') {
          html +=
          '<div class="space_bar"></div>\
            <div class="rate_table">\
              <div class="rate_title" onclick="showRateChart(this)" aria-expanded="false">중개보수 요율표<small class="rate_type notice">('+getSval+', '+getSubTabCate+', '+getThirdTabCate+')</small>\
              <img src="img/right_arrow.svg">\
              </div>\
              <div class="enforcement notice">2021.10.19 시행 | 공인중개사법 시행규칙 제20조 제1항, 별표1</div>\
          <div class="rate_box" style="display:none">\
              <div class="rate_cate">\
                <div class="rate_cate_one">\
                  <div class="rate_chart"><div>거래금액</div><div>상한요율</div><div>한도액</div></div>\
                  <div class="rate_list">\
                    <div class="list_1"><div>5천만원 미만</div>';
                    if(getThirdTabCate === '매매/교환') html += '<div>0.6%</div><div>250,000원</div></div>';
                    else html += '<div>0.5%</div><div>200,000원</div></div>';
                    if(getThirdTabCate === '매매/교환') html += '<div class="list_2"><div>5천만원 이상</br>~2억원 미만</div><div>0.5%</div><div>800,000원</div></div>';
                    else html += '<div class="list_2"><div>5천만원 이상</br>~1억원 미만</div><div>0.4%</div><div>300,000원</div></div>';
                    if(getThirdTabCate === '매매/교환') html += '<div class="list_3"><div>2억원 이상</br>~9억원 미만</div><div>0.4%</div><div>-</div></div>';
                    else html += '<div class="list_3"><div>1억원 이상</br>~6억원 미만</div><div>0.3%</div><div>-</div></div>';
                    if(getThirdTabCate === '매매/교환') html += '<div class="list_4"><div>9억원 이상</br>~12억원 미만</div><div>0.5%</div><div>-</div></div>';
                    else html += '<div class="list_4"><div>6억원 이상</br>~12억원 미만</div><div>0.4%</div><div>-</div></div>';
                    if(getThirdTabCate === '매매/교환') html += '<div class="list_5"><div>12억원 이상</br>~15억원 미만</div><div>0.6%</div><div>-</div></div>';
                    else html += '<div class="list_5"><div>12억원 이상</br>~15억원 미만</div><div>0.5%</div><div>-</div></div>';
                    if(getThirdTabCate === '매매/교환') html += '<div class="list_6"><div>15억원 이상</div><div>0.7%</div><div>-</div></div>';
                    else html += '<div class="list_6"><div>15억원 이상</div><div>0.6%</div><div>-</div></div>';
          html +=  '</div>\
                </div>\
              </div>\
            </div>\
          </div>';
        }
      }
    }

    sum.innerHTML = html;
    upper = '.' + upper;
    if (getSubTabCate === '주택') document.querySelector(upper).classList.add('active');
    
    var id = Math.floor(new Date().getTime() + Math.random());

    newRecord = {};
    newRecord.id = id;
    newRecord.type = getTabCate;
    newRecord.date = getDate;
    newRecord.title = document.querySelector('.edit_box').value;

    if (getTabCate === "전세자금대출") {
      var getPayType = document.querySelector('.repay_method div.active'),
          getStep = getPayType.innerHTML,
          getTerm = document.querySelector('.change.mark').innerHTML,
          interestRate = Number(getSteps[1].value.replaceAll(',', ''));

      newRecord.info1 = loanAmount.toLocaleString('ko-KR') + ' 원';
      newRecord.info2 = interestRate + ' ' + getTerm;
      newRecord.info3 = numPayments + ' %';
      newRecord.info4 = getStep;
      newRecord.info5 = document.querySelector('.sum_one').innerHTML;
      newRecord.info6 = document.querySelector('.sum_two').innerHTML;
      newRecord.info7 = document.querySelector('.sum_thirds').innerHTML;
      
      if(getStep !== '만기일시') {
        newRecord.info8 = document.querySelector('.sum_info div').innerHTML;
      }
    } else if(getTabCate === "부동산 중개보수") {
      newRecord.info1 = getSubTabCate;
      newRecord.info2 = document.querySelector('select').value;
      newRecord.info3 = document.querySelector('.subtab.active').innerHTML;
      newRecord.info4 = loanAmount.toLocaleString('ko-KR');
      newRecord.info5 = getSteps[1].value + ' %';
      newRecord.info6 = brokerageSum.toLocaleString('ko-KR') + ' 원';
      newRecord.info7 = rate + ' %';
      newRecord.info8 = loanAmount.toLocaleString('ko-KR');
      newRecord.info9 = getSteps[0].value;
    } else {
      if(getLoanType === '개월') getLoanVal = (getLoanVal * 12) / 12;
      if(getReminType === '개월') getRemainVal = (getRemainVal * 12 ) / 12;

      CalcCharge = CalcCharge * 100;

      newRecord.info1 = loanAmount.toLocaleString('ko-KR') + ' 원';
      newRecord.info2 = getLoanVal + ' ' + getLoanType;
      newRecord.info3 = getRemainVal + ' ' + getReminType;
      newRecord.info4 = CalcCharge + ' %';
      newRecord.info5 = Number(getSteps[3].value) + ' 년';
      newRecord.info6 = chargeCalc.toLocaleString('ko-KR') + ' 원';
    }
  }
  if (calcInput) {
    calcBtn.innerHTML = '저장하기';
    calcBtn.setAttribute('onclick', 'saveRecordList(newRecord)');
  }
}

const showRecordPopup = (id) => {
  html = '';
  id = Number(id);

  let findRecordDesc = orgRecord.filter((getRecord) => getRecord.id === id);
  const recordPopup = document.querySelector('.record_popup'),
        record = findRecordDesc[0];
  
  animate(recordPopup, 'left', 0);
  html =
    `<div class="record_title popup_recordTitle">
      <small>${record.type}</small>
    <div><input type="text" class="edit_box" id="recordTitle" onpaste="return false;" onfocus="this.blur()" readonly value="${record.title}
    "onkeydown="checkKey(event)" maxlength="15" oninput="maxLengthChk(this)"><img src="img/edit.svg" role="button" aria-label="계산기 제목 수정" class="edit_btn record_edit" onclick="editTitleSave(this, ${id})"></div></div>`;
  
  switch (record.type) {
  case "전세자금대출":
    html +=
      `<div class="record_desc">
      <div class="calc_type">대출금액<div class="info">${record.info1.toLocaleString('ko-KR')} 원</div></div>
      <div class="principal">대출기간<div class="info">${record.info2}</div></div>
      <div class="interest">연이자율<div class="info">${record.info3}</div></div>
      <div class="Summation">상환방법<div class="info">${record.info4}</div></div>
      <div class="border_bar"></div>
      <div class="calc_type">대출원금<div class="info">${record.info5}</div></div>
      <div class="principal">총 대출이자<div class="info">${record.info6}</div></div>
      <div class="interest">총 상환금액<div class="info">${record.info7}</div></div>`;
    if (record.info4 !== '만기일시') {
      html +=
        `<div class="border_bar"></div>
        <div class="sum_info">1회차 상환금액<div>${record.info8}</div></div>`;
    }
    html += `</div><div class='notice' style='color: #414141'>* 월단위로 계산된 이자이기 때문에 일단위로 계산되는 금융기관의 대출 이자와는 차이가 있습니다.</div>`;
    break;

  case "부동산 중개보수":
    html +=
      `<div class="record_desc">
        <div class="calc_type">매물유형<div></div><div class="info">${record.info1}</div></div>`;
    switch (record.info1) {
      case '주택':
        html += `<small class="notice">주택의 부속토지, 주택분양권 포함</small>`;
        break;
      case '오피스텔':
        html += `<small class="notice">부엌화장실등의 시설을 갖춘 전용면적 85㎡ 이하 오피스텔</small>`;
        break;
      default:
        html += `<small class="notice">오피스텔(주거용 제외), 상가, 토지 등</small>`;
    }
    html +=
      `<div class="principal">거래지역<div class="info">${record.info2}</div></div>
      <div class="interest">거래유형<div class="info">${record.info3}</div></div>`;
    switch (record.info3) {
      case '전세':
        html += `<div class="Summation">보증금<div class="info">${record.info4} 원</div></div>`;
        break;
      case '월세':
        html +=
          `<div class="Summation">보증금<div class="info">${record.info4} 원</div></div>
          <div class="Summation">월세<div class="info">${record.info9} 원</div></div>`;
        break;
      default:
        html += `<div class="Summation">거래금액<div class="info">${record.info4} 원</div></div>`;
    }
    html +=
      `<div class="Summation">협의보수율<div class="info">${record.info5}</div></div>
      <div class="border_bar"></div>
      <div class="calc_type">최대 중개보수<div class="info">${record.info6}</div></div>
      <div class="principal">협의/상한요율<div class="info">${record.info7}</div></div>
      <div class="interest">거래금액<div class="info">${record.info8} 원</div></div>`;
    break;

  default:
    html +=
      `<div class="record_desc">
        <div class="calc_type">상환금액<div class="info">${record.info1}</div></div>
        <div class="principal">대출기간<div class="info">${record.info2}</div></div>
        <div class="interest">잔존기간<div class="info">${record.info3}</div></div>
        <div class="Summation">수수료율<div class="info">${record.info4}</div></div>
        <div class="border_bar"></div>
        <div class="calc_type">중도상환 수수료<div class="info">${record.info6}</div></div>
        <span class="notice">정확한 수수료율은 대출 계약서를 확인하세요.</span>`;
}
  html +=
    `<div class="record_delete" style="color: #000">\
      <div class="record_date popup_date" onclick="showRecordPopup(${record.id})">${record.date}</div>
    </div>
    </div>`;

  document.querySelector('.popup_desc').innerHTML = html;

  var html = `<div class='share_btn' onclick = 'setTimeout(shareRecord(this))'>URL 복사하기<img src='img/url_icon.svg'></div >
              <div class='delete_btn'onclick='deletRecord(${id})'><img src='img/delte_icon.svg'></div>`;
  
  document.querySelector('.share_btns').innerHTML = html;
};

const checkKey = (event) => {
  const editBox = document.querySelector('.edit_box'),
        getTitle = editBox.value;

  if (event.keyCode === 13) {
    if (getTitle === "") {
      showToast('제목을 입력해 주세요');
      editBox.focus;
    } else {
      editBox.setAttribute('.readonly', true);
      editBox.setAttribute('.onfocus', 'this.blur()');
      editBox.classList.remove('active');
      editBox.blur;

      const findRecordDesc = orgRecord.filter((getRecord) => getRecord.id === id),
            record = findRecordDesc[0];

      record.title = getTitle;
      saveRecord();
      setRecordList();
    }
  }
};

const editTitleSave = (e, id) => {
  const getTitle = document.querySelector('.edit_box').value,
        recordTitle = document.querySelector('#recordTitle'),
        recordCons = document.querySelector('.record_cons');

  if (e.classList.contains('active')) {
    e.classList.remove('active');
    if (getTitle === "") {
      showToast('제목을 입력해 주세요');

      recordTitle.removeAttribute('readonly');
      recordTitle.setAttribute('onfocus', true);
      recordTitle.focus();
      e.classList.add('active');

      e.setAttribute('aria-label', '계산기 제목 수정 완료');
      return;
    } else {
      const findRecordDesc = orgRecord.filter((getRecord) => getRecord.id === id),
            record = findRecordDesc[0];
      
      recordTitle.setAttribute('readonly', true);
      recordTitle.setAttribute('onfocus', 'this.blur()');
      recordTitle.blur();
      record.title = getTitle;

      e.setAttribute('aria-label', '계산기 제목 수정');
      saveRecord();
    }
  } else {
    e.classList.add('active');
    recordTitle.removeAttribute('readonly');
    recordTitle.removeAttribute('onfocus');
    recordTitle.focus();
    recordCons.innerHTML = '';

    setInputCursorPositonToLast(document.querySelector('.edit_box'));
  }
  setRecordList();
};

const editTitle= (e) => {
  const getTitle = document.querySelector('#popupTitle').value,
        popupTitle = document.querySelector('#popupTitle'),
        editBtn = document.querySelector('.edit_btn'),
        editBox = document.querySelector('.edit_box');

  if (!e.classList.contains('active')) {
    e.classList.add('active');
    popupTitle.removeAttribute('readonly');
    popupTitle.setAttribute('onfocus', true);
    popupTitle.focus();
    editBtn.classList.add('active');
    e.setAttribute('aria-label', '계산기 제목 수정');

    setInputCursorPositonToLast(popupTitle);
  } else {
    if (getTitle === "") {
      showToast('제목을 입력해 주세요');
      editBox.focus;
    } else {
      popupTitle.setAttribute('readonly', true);
      popupTitle.setAttribute('onfocus', 'this.blur()');
      e.setAttribute('aria-label', '계산기 제목 수정 완료');
      editBtn.classList.remove('active');
      popupTitle.blur();
    }
  }
};

const focusToScroll = (e, t) => {
  const tabContainer = document.querySelector('.'+ t),
        tabWidth = e.offsetWidth,
        tabLeft = e.offsetLeft,
        containerWidth = tabContainer.offsetWidth,
        scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 8);
  
  tabContainer.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
};

const showQna = (e) => {
  html = "";
  
  const tabTitle = e.innerHTML;
      
  if (e !== '전체') focusToScroll(e, 'extra_tabs');

  if(tabTitle != undefined) {
    e.classList.add('active');
    e.setAttribute('aria-selected', true);
    for (let sibling of e.parentNode.children) {
      if (sibling !== e) {
         sibling.classList.remove('active');
         sibling.setAttribute('aria-selected', false);
      }
    }
  }

  if (e === '전체' || tabTitle === '전체') {
    html +=
      '<div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">원리금균등 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>원리금균등상환은 매월 동일한 원금과 이자를 상환하는 방식입니다. 즉 1천만원을 3%의 금리로 12개월간 대출 시 매월 846,936원의 일정한 금액을 상환하기 때문에 재정계획 설립하기에 용이합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">원리금균등 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>월마다 내야할 금액(월불입금)의 계산식은 다음과 같습니다.</br>\
      원금*이자율/12*(1+이자율/12)^기간/((1+이자율/12)^기간-1)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">원금균등 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>원금균등상환은 매월 동일한 원금과 남은 잔금에 상응하는 이자를 매월 상환하는 방식입니다. 즉 1천만원 12개월간 대출하신 경우 매월 833,333원의 원금을 상환하며 잔금에 3%의 금리를 적용하여 산출한 이자를 함께 지불합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">원금균등 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>월마다 내야하는 월불입금(원리금)의 계산방법은 아래와 같습니다.</br>\
      월불입금 = {원금 / 기간(월)} + {대출잔액 X 이자율 X 12}</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">만기일시 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>만기일시 상환은 대출을 받은 뒤, 만기일까지 매월 이자만 상환 하다가 만기에 대출 원금 전액을 한꺼번에 갚은 방식입니다. 초기에는 원금을 갚지 않아도 되기 때문에 부담이 적지만 만기 때 목돈이 필요하며, 세 가지 상환 방식 중 총 이자 부담액이 가장 큰 단점이 있습니다.\
      </div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">만기일시 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>만기일시에 상환하는 만기일시의 계산방법은 아래와 같습니다.</br>\
      대출원금 * ( 연 이자율/12 ) * (대출기간(년) * 12)\
      </div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">부동산 중개보수가 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>부동산 중개보수란? 부동산중개사가 중개를 한 대가로 받는 보수를 말하며, 보수의 지불시기는 다른 약정이 없는 한 거래대금을 완불할 때 다음의 요율 및 한도액의 범위내에서 거래당사자가 각각 부담합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">주택 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.6%	250,000원</br>\
      5천만원 이상~2억원 미만	0.5%	800,000원</br>\
      2억원 이상~9억원 미만	0.4%	-</br>\
      9억원 이상~12억원 미만	0.5%	-</br>\
      12억원 이상~15억원 미만	0.6%	-</br>\
      15억원 이상	0.7%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">오피스텔 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.5%	200,000원</br>\
      5천만원 이상~1억원 미만	0.4%	300,000원</br>\
      1억원 이상~6억원 미만	0.3%	-</br>\
      6억원 이상~12억원 미만	0.4%	-</br>\
      12억원 이상~15억원 미만	0.5%	-</br>\
      15억원 이상	0.6%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">주택 외 부동산 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.5%	200,000원</br>\
      5천만원 이상~1억원 미만	0.4%	300,000원</br>\
      1억원 이상~6억원 미만	0.3%	-</br>\
      6억원 이상~12억원 미만	0.4%	-</br>\
      12억원 이상~15억원 미만	0.5%	-</br>\
      15억원 이상	0.6%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">중개보수 비용은 언제 지급하나요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>개업공인중개사와 중개의뢰인간 약정에 따르되 약정이 없으면 잔금시 지급합니다(공인중개사법 시행령 27조의2)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">중개보수도 현금영수증 발급이 되나요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>중개수수료는 세법에 의거 의무적으로 현금영수증을 발행해야 합니다</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">중도상환 수수료가 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>은행이 채무자로부터 >중도상환 수수료를 받는 것은, 당초 약정기간동안 대출금을 운용하여 얻을 수 있는 수익을 채무자가 기한전에 미리 갚음으로 인해 얻지 못하게 되는 것에 대한 보전 성격이 있는 수수료입니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">중도상환 수수료를 내야하는 이유가 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>중도상환 수수료는 자금운용의 기회비용을 최소화하기 위하여 부과되는 비용입니다.\
      즉, 만기에 상환될 것이라고 예상하였던 대출금이 중도상환될 경우 은행입장에서는 향후 이자수입을 잃게 되거나 상환받은 자금을 더 낮은 이율로 운용해야하므로 통상적으로 대출계약시 중도상환 위약금에 관한 규정을 두고 있습니다.\
      참고로 구체적인 수수료 금액은 상환금액, 상환기간 등에 따라 은행이 자율적으로 정하고 있습니다.\
      </div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">중도상환 수수료 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>중도상환 계산 방법은 아래 식으로 계산할 수 있습니다.\
      >중도상환 수수료 = 중도상환액 x 수수료율 x (잔존기간 / 전체 대출기간)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">중도상환 수수료 면제기간이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>일부 대출은 일정 기간이 지나면 >중도상환 수수료를 면제해주기도 합니다.</br>\
      면제기간이 있는 경우 >중도상환 수수료 계산 방법은 아래와 같습니다.</br>\
      >중도상환 수수료 = 중도상환액 x 수수료율 x (면제기간까지 남은 기간 / 면제기간)</br>\
      예를 들어, 주택담보대출을 받고 2년째 되는 날에 1억을 중도상환한다면 아래과 같이 >중도상환 수수료는 50만원으로 계산됩니다.\
      (수수료율 1.5% 가정 시)</br>\
      ㄴ만약 정확하게 연단위 계산이 되지 않는다면 일단위로 환산해서 계산하면 됩니다.</br>\
      >중도상환 수수료 500,000원 = 1억 x 0.015 x (1년 / 3년)\
      </div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">중도상환 수수료 잔존기간이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>잔존기간은 대출 계약서 작성 시 약정했던 전체 대출기간에서 남은 기간을 의미합니다.\
      예를 들어 전체 대출 기간이 10년이고 현재 2년이 지났다면 잔존기간은 8년입니다.</div></div></div>\
     </div>';
  } else if (tabTitle === "전세자금대출") {
    html +=
      '<div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">원리금균등 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>원리금균등상환은 매월 동일한 원금과 이자를 상환하는 방식입니다. 즉 1천만원을 3%의 금리로 12개월간 대출 시 매월 846,936원의 일정한 금액을 상환하기 때문에 재정계획 설립하기에 용이합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">원리금균등 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>월마다 내야할 금액(월불입금)의 계산식은 다음과 같습니다.</br>\
      원금*이자율/12*(1+이자율/12)^기간/((1+이자율/12)^기간-1)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">원금균등 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>원금균등상환은 매월 동일한 원금과 남은 잔금에 상응하는 이자를 매월 상환하는 방식입니다. 즉 1천만원 12개월간 대출하신 경우 매월 833,333원의 원금을 상환하며 잔금에 3%의 금리를 적용하여 산출한 이자를 함께 지불합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">원금균등 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>월마다 내야하는 월불입금(원리금)의 계산방법은 아래와 같습니다.</br>\
      월불입금 = {원금 / 기간(월)} + {대출잔액 X 이자율 X 12}</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">만기일시 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>만기일시 상환은 대출을 받은 뒤, 만기일까지 매월 이자만 상환 하다가 만기에 대출 원금 전액을 한꺼번에 갚은 방식입니다. 초기에는 원금을 갚지 않아도 되기 때문에 부담이 적지만 만기 때 목돈이 필요하며, 세 가지 상환 방식 중 총 이자 부담액이 가장 큰 단점이 있습니다.\
      </div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">만기일시 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>만기일시에 상환하는 만기일시의 계산방법은 아래와 같습니다.</br>\
      대출원금 * ( 연 이자율/12 ) * (대출기간(년) * 12)\
      </div></div></div>\
     </div>';
  } else if (tabTitle === "부동산 중개보수") {
    html +=
      '<div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">부동산 중개보수가 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>부동산 중개보수란? 부동산중개사가 중개를 한 대가로 받는 보수를 말하며, 보수의 지불시기는 다른 약정이 없는 한 거래대금을 완불할 때 다음의 요율 및 한도액의 범위내에서 거래당사자가 각각 부담합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">주택 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.6%	250,000원</br>\
      5천만원 이상~2억원 미만	0.5%	800,000원</br>\
      2억원 이상~9억원 미만	0.4%	-</br>\
      9억원 이상~12억원 미만	0.5%	-</br>\
      12억원 이상~15억원 미만	0.6%	-</br>\
      15억원 이상	0.7%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">오피스텔 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.5%	200,000원</br>\
      5천만원 이상~1억원 미만	0.4%	300,000원</br>\
      1억원 이상~6억원 미만	0.3%	-</br>\
      6억원 이상~12억원 미만	0.4%	-</br>\
      12억원 이상~15억원 미만	0.5%	-</br>\
      15억원 이상	0.6%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">주택 외 부동산 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.5%	200,000원</br>\
      5천만원 이상~1억원 미만	0.4%	300,000원</br>\
      1억원 이상~6억원 미만	0.3%	-</br>\
      6억원 이상~12억원 미만	0.4%	-</br>\
      12억원 이상~15억원 미만	0.5%	-</br>\
      15억원 이상	0.6%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">중개보수 비용은 언제 지급하나요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>개업공인중개사와 중개의뢰인간 약정에 따르되 약정이 없으면 잔금시 지급합니다(공인중개사법 시행령 27조의2)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q" role="button" aria-expended="false">중개보수도 현금영수증 발급이 되나요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>중개수수료는 세법에 의거 의무적으로 현금영수증을 발행해야 합니다</div></div></div>\
     </div>';
  } else {
    html +=
   '<div class="q_box" onclick="toggleQna(this)">\
    <div class="q" role="button" aria-expended="false">중도상환 수수료가 뭔가요?<img src="img/open.svg"></div>\
    <div class="a"><div><div>은행이 채무자로부터 >중도상환 수수료를 받는 것은, 당초 약정기간동안 대출금을 운용하여 얻을 수 있는 수익을 채무자가 기한전에 미리 갚음으로 인해 얻지 못하게 되는 것에 대한 보전 성격이 있는 수수료입니다.</div></div></div>\
   </div>\
   <div class="q_box" onclick="toggleQna(this)">\
    <div class="q" role="button" aria-expended="false">중도상환 수수료를 내야하는 이유가 뭔가요?<img src="img/open.svg"></div>\
    <div class="a"><div><div>중도상환 수수료는 자금운용의 기회비용을 최소화하기 위하여 부과되는 비용입니다.\
    즉, 만기에 상환될 것이라고 예상하였던 대출금이 중도상환될 경우 은행입장에서는 향후 이자수입을 잃게 되거나 상환받은 자금을 더 낮은 이율로 운용해야하므로 통상적으로 대출계약시 중도상환 위약금에 관한 규정을 두고 있습니다.\
    참고로 구체적인 수수료 금액은 상환금액, 상환기간 등에 따라 은행이 자율적으로 정하고 있습니다.\
    </div></div></div>\
   </div>\
   <div class="q_box" onclick="toggleQna(this)">\
    <div class="q" role="button" aria-expended="false">중도상환 수수료 계산법은 뭔가요?<img src="img/open.svg"></div>\
    <div class="a"><div><div>중도상환 계산 방법은 아래 식으로 계산할 수 있습니다.\
    >중도상환 수수료 = 중도상환액 x 수수료율 x (잔존기간 / 전체 대출기간)</div></div></div>\
   </div>\
   <div class="q_box" onclick="toggleQna(this)">\
    <div class="q" role="button" aria-expended="false">중도상환 수수료 면제기간이 궁금해요!<img src="img/open.svg"></div>\
    <div class="a"><div><div>일부 대출은 일정 기간이 지나면 >중도상환 수수료를 면제해주기도 합니다.</br>\
    면제기간이 있는 경우 >중도상환 수수료 계산 방법은 아래와 같습니다.</br>\
    >중도상환 수수료 = 중도상환액 x 수수료율 x (면제기간까지 남은 기간 / 면제기간)</br>\
    예를 들어, 주택담보대출을 받고 2년째 되는 날에 1억을 중도상환한다면 아래과 같이 >중도상환 수수료는 50만원으로 계산됩니다.\
    (수수료율 1.5% 가정 시)</br>\
    ㄴ만약 정확하게 연단위 계산이 되지 않는다면 일단위로 환산해서 계산하면 됩니다.</br>\
    >중도상환 수수료 500,000원 = 1억 x 0.015 x (1년 / 3년)\
    </div></div></div>\
   </div>\
   <div class="q_box" onclick="toggleQna(this)">\
    <div class="q" role="button" aria-expended="false">중도상환 수수료 잔존기간이 궁금해요!<img src="img/open.svg"></div>\
    <div class="a"><div><div>잔존기간은 대출 계약서 작성 시 약정했던 전체 대출기간에서 남은 기간을 의미합니다.\
    예를 들어 전체 대출 기간이 10년이고 현재 2년이 지났다면 잔존기간은 8년입니다.</div></div></div>\
   </div>';
  };

  var extraDesc = document.querySelector('.extra_desc');
  extraDesc.innerHTML = html;
};

const shareRecord = (e) => {
  // !! blob:http://10.223.172.238:5500/188f9afe-4901-4a45-b1f2-84d634cc88b5
  const element = document.querySelector('.popup_desc');
  const canvasPromise =  html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    foreignObjectRendering: true
  });

  canvasPromise.then(function (canvas) {
    const dataUrl = canvas.toDataURL('image/png');

    const base64Str = dataUrl.split(",")[1];

    const byteCharacters = atob(base64Str);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'image/png' });

    const imageUrl = URL.createObjectURL(blob);

    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imgElement.alt = 'screenshot';
    document.body.appendChild(imgElement);

    console.log(imageUrl);
  });
};

const downloadUri = (uri, name) =>{
  const link = document.createElement('a');

  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
};

const checkFocus = () => {
  const calcBtn = document.querySelector('.calc_btn'),
        sum = document.querySelector('.sum');

  if(sum) sum.display = 'none';

  calcBtn.display = 'flex';
  calcBtn.innerHTML = '계산하기';
  calcBtn.classList.remove('active');
  calcBtn.setAttribute('onclick', 'calculating()');

  if(document.querySelector('.reset_btn').classList.contains('center')) document.querySelector('.reset_btn').classList.remove('center');
};

const addQuote = (e) => {
  const getVal = e.value,
        getNum = Number(getVal.replaceAll(/,/g, '')),
        quoteNum = getNum.toLocaleString('ko-KR');

  e.value = quoteNum;
};

const setInputCursorPositonToLast = (e) => {
  setTimeout(function () {
    const inputValLength = e.value.length;
    e.setSelectionRange(inputValLength, inputValLength);
  }, 0);
};

const toggleQna = (e) => {
  if(e.classList.contains('active')) {
    e.children[0].children[0].src = 'img/open.svg';
    e.children[0].setAttribute('aria-expended', false);
    e.classList.remove('active');
    e.children[1].classList.remove('active');

    e.children[1].style.height = 0;
  } else {
    e.classList.add('active');
    e.children[1].classList.add('active');
    e.children[1].style.height = `${e.scrollHeight}px`
    e.children[0].setAttribute('aria-expended', true);

    for (let sibling of e.parentNode.children) {
      if (sibling !== e) {
        sibling.classList.remove('active');
        sibling.children[0].setAttribute('aria-expended', false);
        sibling.children[0].children[0].src = 'img/open.svg';
        e.children[0].children[0].src = 'img/close.svg';
        sibling.children[1].classList.remove('active');
        sibling.children[1].style.height = '0';
      }
    }
  }
};

const maxLengthChk = (e) =>{
  const maxLength = 15;
  
	if (e.value.length > maxLength) e.value = (e.value.substring(0, maxLength))
};

let = currentTabList = [];
const sortList = (e) => {
  let = currentTabList = [];

  const recordCons = document.querySelector('.record_cons'),
    sortList = document.querySelector('.sort_list div'),
    getType = document.querySelector('.cate_btn.active').innerHTML;
  
  if (e.classList.contains('active')) {
    e.classList.remove('active');
    recordCons.classList.remove('active');
    sortList.innerHTML = '과거순';
    newest = false;
  } else {
    e.classList.add('active');
    recordCons.classList.add('active');
    sortList.innerHTML = '최신순';
    newest = true;
  }


  const typeMap = {
    '전세자금': '전세자금대출',
    '중도상환': '중도상환 수수료',
    '중개보수': '부동산 중개보수'
  };

  const filterType = typeMap[getType];
  if (filterType) {
    currentTabList.push(orgRecord.filter(record => record.type === filterType));
  }

  if (currentTabList.length > 0) setRecordList(currentTabList, true);
  else setRecordList(orgRecord, true);

  scrollTo(document.querySelector('.record_list'));
  localStorage.setItem("newest", JSON.stringify(newest));

  document.querySelector('.cate_btn.active').click();
};

const hideRecordPopup = () => {
  const recotdPopup = document.querySelector('.record_popup');

  animate(recotdPopup, 'left', '100%');

  document.querySelector('.share_btn').classList.remove('charge', 'brokerage');
  document.querySelector('.record_edit').classList.remove('charge', 'brokerage');
  document.querySelector('.popup_desc').classList.remove('charge', 'brokerage');
  document.querySelector('.edit_btn').classList.remove('charge', 'brokerage');

  document.querySelector('.share_btns').innerHTML = '';
};

const showCalc = (e) => {
  const calc = document.querySelector('.calc'),
        calcTab = document.querySelector('.calc_tab'),
        editBox = document.querySelector('#popupTitle'),
        recordCons = document.querySelector('.record_cons'),
        slideBox = document.querySelector('.no_record');

  for (let sibling of calcTab.parentNode.children) {
    if (sibling !== calcTab) sibling.classList.remove('active');
  }

  editBox.value = '계산기';
  calcTab.childNodes[1].classList.add('active');

  setCharterHtml();
  removeJs('sliderJs');
  animate(calc, 'left', 0);
  showNonRecord();
  if(slideBox === true) recordCons.removeChild(slideBox);
};

const hideCalc = () => {
  const calc = document.querySelector('.calc'),
        calcBtn = document.querySelector('.calc_btn'),
        editBtn = document.querySelector('.edit_btn'),
        resetBtn = document.querySelector('.reset_btn'),
        editBox = document.querySelector('.edit_box'),
        tabs = document.querySelectorAll('.tab');

  animate(calc, 'left', '100%');
  calcBtn.innerHTML = '계산하기';
  calcBtn.style.display = 'flex';
  calcBtn.setAttribute('onclick', 'calculating()');
  editBtn.classList.remove('active');
  resetBtn.classList.remove('center');
  editBox.setAttribute('readonly', true);
  editBox.setAttribute('onfocus', 'this.blur()');

  tabs.forEach(item => {
    if (item !== item[0]) item.classList.remove('active');
  });

  setRecordList();
};

const showRateChart = (e) => {
  const rateBox = document.querySelector('.rate_box');

  if (e.classList.contains('active')) {
    rateBox.style.display = 'none';
    e.classList.remove('active');
    e.setAttribute('aria-expanded', false);
  } else {
    rateBox.style.display = 'block';
    e.classList.add('active');
    e.setAttribute('aria-expanded', true);
  }
};

const showMenu = () => {
  const menuPopup = document.querySelector('.menu_popup');
  animate(menuPopup, "left", 0);
};

const hideMenu = () => {
  const menuPopup = document.querySelector('.menu_popup');
  animate(menuPopup, "left", '100%');
};

const showExtra = () => {
  const extraPopup = document.querySelector('.extra_popup');
  animate(extraPopup, "left", 0);
  showQna("전체");
};

const hideExtra = () => {
  const extraPopup = document.querySelector('.extra_popup');
  animate(extraPopup, "left", '100%');
};

const showOss = () => {
  const osSPopup = document.querySelector('.oss_popup');
  animate(osSPopup, "left", 0);
};

const hideOss = () => {
  const osSPopup = document.querySelector('.oss_popup');
  animate(osSPopup, "left", '100%');
};

const showMonthly = () => {
  const monthTable = document.querySelector('.monthly_table'),
        monthList = document.querySelector('.monthly_list');
  animate(monthTable, 'left', 0);
  scrollTo(monthList);
};

const hideMonthly = () =>  {
  const monthTable = document.querySelector('.monthly_table');
  animate(monthTable, 'left', '100%');
};

const showToast = (title) => {
  const toastEl = `<div class="toast">${title}</div>` ;
  
  if (document.querySelector('.toast') == null) {
    document.body.insertAdjacentHTML("beforeend", toastEl);

    const toast = document.querySelector('.toast');

    fadeIn(toast);
    setTimeout(function(){
      fadeOut(toast);
    }, 800);
  }
};

const fadeOut = (el) => {
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
      el.parentNode.removeChild(el);
    } else {
      requestAnimationFrame(fade);
    }
  })();
};

const fadeIn = (el, display) =>{
  el.style.opacity = 0;
  el.style.display = display || "block";
  
  (function fade() {
    let val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
};

const animate = (el, direction, value) => {
  const frame = () => {
    if (value === 0 || value === '0') el.style.cssText = `display: block; ${direction}: ${value};`;
    else el.style.cssText = `${direction}: ${value}; display: none; `;
  };
  frame();
};

const scrollTo = (el) => {
  el.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const showType = (e) => {
  const newest = localStorage.getItem('newest');
  let getType = e.innerHTML,
      currentTabList = [];
      
  focusToScroll(e, 'tab_pannel');
  e.classList.add('active');
  e.setAttribute('aria-selected', true);

  for (let sibling of e.parentNode.children) {
    if (sibling !== e) {
      sibling.classList.remove('active');
      sibling.setAttribute('aria-selected', false);
    }
  }

  const typeMap = {
    '전세자금': '전세자금대출',
    '중도상환': '중도상환 수수료',
    '중개보수': '부동산 중개보수'
  };

  if (getType === '전체') {
    currentTabList = orgRecord;
  } else {
    const filterType = typeMap[getType];
    if (filterType) {
      currentTabList = orgRecord.filter(record => record.type === filterType);
    }
  }

  if (currentTabList.length === 0) {
    showNonRecord();
  } else {
    setRecordList(currentTabList, newest);
  }
};

const setBasicAcc = () => {
  // return;
  
  for (
    var t = document.querySelectorAll(".aria-txt"),
    e = document.querySelectorAll(".img-txt, [role='button']"),
    r = document.querySelectorAll(".aria-hidden"), l = document.querySelectorAll("acc"), i = 0,
    f = document.querySelectorAll('.back_btn');
    
    i < t.length;
    i++
  )
    
  t[i].setAttribute("tabindex", 0), t[i].setAttribute("role", "text");
  for (var i = 0; i < e.length; i++) e[i].setAttribute("tabindex", 0);
  for (var i = 0; i < r.length; i++) r[i].setAttribute("aria-hidden", !0);
  for (var i = 0; i < l.length; i++) l[i].setAttribute("tabindex", 0), l[i].setAttribute("role", "text");
  for (var i = 0; i < f.length; i++) {
    let e = f[i],
        accLabel = e.getAttribute('value') + ', 뒤로';

    e.setAttribute("aria-label", accLabel),
    e.setAttribute("role", "button");
  }

  setRecordaAcc();
};

const setRecordaAcc = () => {
  const recordBoxes = document.querySelectorAll('.record_box'),
        records = JSON.parse(localStorage.getItem('record'));

  recordBoxes.forEach(recordBox => {
    const recordId = recordBox.getAttribute('id'),
          record = records.find(r => JSON.stringify(r.id) === recordId);

    if (record) {
      let acc = '제목 : ' + record.title + ', ';

      switch (record.type) {
        case '전세자금대출':
          acc += `계산 유형 : ${record.type}, 대출원금 : ${record.info1}, 총 대출이자 : ${record.info6}, 총 상환금액 : ${record.info7}`
          break;
        case '부동산 중개보수':
          acc += `계산 유형: ${ record.type }, 최대 중개보수: ${ record.info6 }, 협의 / 상환요율 : ${ record.info7 }, 거래금액: ${ record.info8 } 원`
          break;
        case '중도상환 수수료':
          acc += `계산 유형 : ${record.type}, 중도상환 수수료 : ${record.info6}, 총 상환금액 : ${record.info6} 원`
          break;
        
      }
      acc += `, 날짜 : ${record.date}`;
      recordBox.setAttribute('aria-label', `${acc}, 상세보기`);
    }
  });
};

const showNonRecord = () => {
  const recordBox = document.querySelector('.record_box '),
        recordCon = document.querySelector('.record_cons ');

  html = '<div class="noType_record">유형에 맞는 계산기록이 없습니다.</div>';
  if(recordCon.childNodes > 0) recordCon.removeChild(recordBox);
  recordCon.innerHTML = html;
};

const includeJs = (jsFilePath, scriptId) => {
  const head = document.getElementsByTagName('head')[0],
        js = document.createElement('script');
  
  js.type = 'text/javascript';
  js.src = jsFilePath;
  js.id = scriptId;

  head.appendChild(js);
};

const removeJs = (scriptId) => {
  const script = document.getElementById(scriptId);
  if(script) script.parentNode.removeChild(script);
};
