var html = "",
    today = new Date(),
    year = today.getFullYear(),
    month = today.getMonth() + 1,
    date = today.getDate(),
    getDate = year + "년 " + month + "월 " + date + "일",
    newRecord = {},
    calcInput = false,
    getLocalRecod = localStorage.getItem("record"),
    getNewest = localStorage.getItem('newest');

let orgRecord,
    newest;

window.onload = function () {
  $(".splash").fadeIn();
  setTimeout(() => {
    $(".splash").fadeOut();
    $('.add').show();
  }, "1000");

  if(getLocalRecod === '[]' || getLocalRecod === null || getLocalRecod === undefined || getLocalRecod === '') {
    orgRecord = [];
    setNoRecord();
  } else {
    orgRecord = JSON.parse(localStorage.getItem('record'));

    if(getNewest === null || getNewest === 'false') {
      newest = false;
      localStorage.setItem("newest", JSON.stringify(newest));
      $('.record_cons').removeClass('active');
      $('.sort_list').find('div').removeClass('active');
      $('.sort_list').find('div').html('과거순');
    } else {
      getNewest = localStorage.getItem('newest');

      if(newest !== false) {
        $('.record_cons').addClass('active');
        $('.sort_list').find('div').addClass('active');
        $('.sort_list').find('div').html('최신순');
      } else {
        $('.slider, .record_cons').removeClass('active');
        $('.sort_list').find('div').html('과거순');
      }
    }
    setRecordList();
    $('.add_btn').show();
  }
};

function setNoRecord() {
  html = "<div class='no_record'><img src='img/no_record.svg'>저장된 계산 기록이 없습니다.<br>아래의 새로운 계산기 버튼을 눌러보세요.<div class='calc_shorcut' onclick='showCalc()'>+ 새로운 계산기</div></div>";
  $('.sort_list').hide();
  $(".record_cons").html(html);
  $(".slider, .record_cons").removeClass('active');
  localStorage.clear();
  $('.add_btn').hide();
}

function setRecordList() {
  html = "";

  $('.sort_list').show();
  orgRecord.forEach(function (record) {
    if(record.type === '전세자금대출') {
      html +=
      '<div class="record_box bg_1" id=' +
      record.id +
      '>';
    } else if(record.type === "부동산 중개보수") {
      html +=
      '<div class="record_box bg_2" id=' +
      record.id +
      '>';
    } else {
      html +=
      '<div class="record_box bg_3" id=' +
      record.id +
      '>';
    }
    html +=  '<div class="record_title" onclick="showRecordPopup(' +
      record.id +
      ')">' +
      record.title +
      '</div>\
        <div class="record_desc" onclick="showRecordPopup(' +
      record.id +
      ')">';
      html +=
        '<div class="calc_type opacity font-size">계산 유형<div class="info" style="opacity: 1; font-weight: normal;">' +
        record.type +
        '</div></div>';
    if (record.type === "전세자금대출") {
      html +=
        '<div class="principal opacity font-size">대출원금<div class="info" style="opacity: 1; font-weight: normal;">' +
        record.info1.toLocaleString('ko-KR') +
        ' 원</div></div>\
        <div class="interest opacity font-size">총 대출이자<div class="info "style="opacity: 1; font-weight: normal;">' +
        record.info6 +
        '</div></div>\
        <div class="Summation opacity font-size">총 상환금액<div class="info" style="opacity: 1; font-weight: normal;">' +
        record.info7 +
        "</div></div>";
    } else if (record.type === "부동산 중개보수") {
      html +=
        '<div class="principal opacity font-size">최대 중개보수<div class="info" style="opacity: 1; font-weight: normal;">' +
        record.info6 +
        '</div></div>\
        <div class="interest opacity font-size">협의 / 상한요율<div class="info" style="opacity: 1; font-weight: normal;">' +
        record.info7 +
        '</div></div>\
        <div class="Summation opacity font-size">거래금액<div class="info" style="opacity: 1; font-weight: normal;">' +
        record.info4 +
        " 원</div></div>";
    } else {
      html +=
        '<div class="calc_type opacity font-size">중도상환 수수료<div class="info" style="opacity: 1; font-weight: normal;">' +
        record.info6 +
        "</div></div>";
    }

    html +=
      '</div>\
        <div class="space_bar"></div>\
        <div class="record_delete list_delete">\
          <div class="record_date" onclick="showRecordPopup(' +
      record.id +
      ')">' +
      record.date +
      '</div>\
          <div class="delet_btn" onclick="deletRecord(' +
      record.id +
      ')"><img src="img/del_icon.svg"></div>\
        </div>\
      </div>';

    $(".record_cons").html(html);
  });

  $('.add_btn').show();
}

function saveRecord() {
  localStorage.setItem("record", JSON.stringify(orgRecord));
}

function deletRecord(id) {
  var getRecordBox = $("#" + id + "");

  $(".record_popup").animate({'left' : '100%'}, 150);
  getRecordBox.fadeOut(function () {
    getRecordBox.remove();
  });

  if ($(".record_cons").children().length === 1) setNoRecord();

  orgRecord = orgRecord.filter((newRecord) => newRecord.id !== parseInt(id));
  saveRecord();
}

function selectTerm(e) {
  var getType = $(e).text(),
    getText = $(e).parent(".select_box").siblings("div").find(".change.mark"),
    getInput = $(e).parent(".select_box").siblings("div").find("input"),
    getValue = getInput.val(),
    fixValue = "";

  $(e).addClass("active");
  $(e).siblings().removeClass("active");
  $(e).attr("onclick", "selectTerm(this)");
  $(".calc_btn").html("계산하기");
  $(".calc_btn").attr("onclick", "calculating()");
  $(".calc_btn").show();
  $(".calc_btn").removeClass('active');
  $(".reset_btn").removeClass('center');
  $(".sum").hide();

  if ($(e).hasClass("active")) {
    $(e).attr("onclick", "");
    $(e).siblings().attr("onclick", "selectTerm(this)");
  }


  if (getType === "년" || getType === "개월") {
    getText.html(getType);
    if (getType === "년") {
      getValue = getValue / 12;
      getInput.removeClass("padding");
      getInput.attr('maxlength', '2');
    } else {
      (getValue = getValue * 12), getInput.addClass("padding");
      getInput.attr('maxlength', '3');
    }
    fixValue = getValue.toFixed(0);
    if (fixValue !== "0") getInput.val(fixValue);
  }
}

function select(e) {
  var getType = $(e).html();

  $(e).addClass("active");
  $(e).siblings().removeClass("active");
  $(".calc_btn").removeClass('active');
  $(".sum").hide();

  if ($(e).hasClass("active")) {
    $(".calc_btn").html("계산하기");
    $(".calc_btn").attr("onclick", "calculating()");
  }

  if(getType === '주택') {
    $('.tag').html('주택의 부속토지, 주택분양권 포함');
    $('select').prop('disabled', false);
    $('.nationwide').hide();
    $('option:first-child').prop('selected', true);
  }
  else if(getType === '오피스텔') {
    $('.tag').html('부엌화장실등의 시설을 갖춘 전용면적 85㎡ 이하 오피스텔');
    $('select').prop('disabled', true);
    $('.nationwide').show();
    $('.nationwide').prop('selected', true);
  }
  else if(getType === '주택 외'){
    $('.tag').html('오피스텔(주거용 제외). 상가, 토지 등');
    $('select').prop('disabled', true);
    $('.nationwide').show();
    $('.nationwide').prop('selected', true);
  }

  if(getType === '주택' || getType === '오피스텔' || getType === '주택 외') {
    $('.subtab').addClass("active");
    $('.subtab').siblings().removeClass("active");
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
        <input type="text" name="거래금액" class="except" inputmode="numeric" onfocus="checkFocus()" maxlength="12" onkeyup="addQuote(this)"><small class="mark" onpaste="return false;">원</small>\
      </div>\
       <div class="step_third">협의보수율\
         <input name="협의보수율" type="text" id="interestRate" onkeyup="addQuote(this)" inputmode="numeric" onfocus="checkFocus()" maxlength="8" class="except">\
         <small class="mark">%</small>\
       </div>\
       <span class="notice">협의보수율을 입력하지 않거나, 상한요율보다 높으면 상한요율이 적용됩니다.</span>';
  } 
  $('.change_steps').html(html)
}

function refreshInput() {
  var getAllInput = document.querySelectorAll("input:not(.edit_box)");
  for (var i = 0; i < getAllInput.length; i++) {
    getAllInput[i].value = null;
  }
  $(".sum").hide();
  $(".calc_btn").show();
  $(".calc_btn").html("계산하기");
  $(".reset_btn").removeClass("center active");
  $(".calc_btn").attr("onclick", "calculating()");
  $('.calc_btn').removeClass('active');
}

function showCalcDetail(e) {
  var getValue = $(e).text();
  if ($(e).hasClass("active")) {
    return;
  } else {
    $(e).addClass("active");
    if (getValue === "전세자금대출") setCharterHtml();
    else if (getValue === "중도상환 수수료") setRepaymentHtml();
    else setEstateHtml();
  }
  $(e).siblings().removeClass("active");
  checkFocus();
}

function setCharterHtml() {
  html =
    '<div class="steps">\
    <div class="step_one">대출금액\
      <input name="대출금액" type="text" pattern="[0-9]*" inputmode="numeric" maxlength="12" onfocus="checkFocus()" onkeyup="addQuote(this)"  onpaste="return false;"><small class="mark">원</small>\
      <div class="as_loan"></div>\
    </div>\
    <div class="step_two">대출기간\
      <div class="select_box">\
        <div class="year active">년</div>\
        <div class="month" onclick="selectTerm(this)">개월</div>\
      </div>\
      <div><input name="대출기간" type="text" class="change input" inputmode="numeric" maxlength="2" onfocus="checkFocus()"  onpaste="return false;"><small class="change mark">년</small></div>\
    </div>\
    <div class="step_third">연이자율\
      <input name="연이자율" type="text" maxlength="2" inputmode="numeric" onfocus="checkFocus()"  onpaste="return false;">\
      <small class="mark">%</small>\
    </div>\
    <div class="step_four">상환방법\
      <div class="select_box repay_method">\
        <div class="select_one active" onclick="select(this)">원리금균등</div>\
        <div class="select_two" onclick="select(this)">원금균등</div>\
        <div class="select_third" onclick="select(this)">만기일시</div>\
      </div>\
    </div>\
  </div>\
  <div class="space_bar"></div>\
  <div class="sum">\
  </div>';

  $(".calc_box").html(html);
  $(".reset_btn").removeClass("center");
  $(".calc_btn").removeClass("active");
  $(".calc_btn").show();
}

function setEstateHtml() {
  html =
    '<div class="steps">\
    <div class="step_four property_tab">매물유형\
      <div class="select_box">\
        <div class="active" onclick="select(this)">주택</div>\
        <div onclick="select(this)">오피스텔</div>\
        <div onclick="select(this)">주택 외</div>\
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
        <div class="subtab active" onclick="select(this)">매매/교환</div>\
        <div onclick="select(this)">전세</div>\
        <div onclick="select(this)">월세</div>\
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

  $(".calc_box").html(html);
}

function setRepaymentHtml() {
  html =
    '<div class="steps">\
    <div class="step_one">상환금액\
      <input name="상환금액" type="text" pattern="[0-9]*" inputmode="numeric" maxlength="12" onkeyup="addQuote(this)" onfocus="checkFocus()" onpaste="return false;"><small class="mark">원</small>\
    </div>\
    <div class="step_two">대출기간\
      <div class="select_box loan_select">\
        <div class="year active">년</div>\
        <div class="month" onclick="selectTerm(this)">개월</div>\
      </div>\
      <div><input name="대출기간" type="text" inputmode="numeric" class="change input" onfocus="checkFocus()" maxlength="2" onpaste="return false;"><small class="change mark">년</small></div>\
    </div>\
    <div class="step_two">잔존기간\
      <div class="select_box remain_select">\
        <div class="year active">년</div>\
        <div class="month" onclick="selectTerm(this)">개월</div>\
      </div>\
      <div><input name="잔존기간" type="text" inputmode="numeric" class="change input" onfocus="checkFocus()" maxlength="2" onpaste="return false;"><small class="change mark">년</small></div>\
    </div>\
    <div class="step_third">수수료율\
      <input name="수수로율" type="text" inputmode="numeric" onfocus="checkFocus()" maxlength="3" onpaste="return false;">\
      <small class="mark">%</small>\
    </div>\
  </div>\
  <div class="space_bar"></div>\
  <div class="sum">\
  </div>';

  $(".calc_box").html(html);
}

function saveRecordList(newRecord) {
  orgRecord.push(newRecord);
  setRecordList();
  saveRecord();
  showToast('저장이 완료되었습니다');

  $(".reset_btn").addClass("center");
  $(".calc_btn").hide();

  $(".edit_box").prop("readonly", true);
  $(".edit_box").attr("onfocus", "this.blur()");
  $(".edit_box").blur();
  $(".edit_btn").removeClass("active");
}

var upper = '';
function calculating() {
  var getCate = document.querySelectorAll(".tab"),
      getSteps = document.querySelectorAll("input:not(.edit_box)"),
      getTitle = $(".edit_box").val();

  if (getTitle === "") {
    showToast('제목을 입력해 주세요');
    $(".edit_box").focus();
    return;
  };

  for (var i = 0; i < getCate.length; i++) {
    var getTabCate = $(".tab.active").html();
    for (var i = 0; i < getSteps.length; i++) {
      var getStepType = getSteps[i].name,
      getStepVal = Number(getSteps[i].value); 

      if (getStepVal === "" || getStepVal <= 0) {
        if(getStepType === '월세') {
          showToast(""+getStepType+"를 입력해 주세요");
          getSteps[i].focus();
        } else {
          showToast(""+getStepType+"을 입력해 주세요");
          getSteps[i].focus();
        }

        $(".sum").hide();
        return;
      } else {
        calcInput = true;
        $(".sum").show();
        $(".calc_btn").addClass("active");
      }

      calcInput = true;
      $(".sum").show();
      $(".calc_btn").addClass("active");

      if($('.month').hasClass('active')) {
        interestRate = interestRate / 12;
      }

      if(getTabCate === '부동산 중개보수') var numPayments = '';
      else var numPayments = (Number(getSteps[2].value) / 10) / 10;

      var loanAmount = Number(getSteps[0].value.replaceAll(',', '')),
          interestRate = Number(getSteps[1].value.replaceAll(',', '')),
          loanAmountCalc = loanAmount * numPayments,
          loanAmountSum = loanAmountCalc * interestRate,
          interestSum = loanAmount + loanAmountSum,
          monthCalc =  loanAmountCalc / 12,
          monthSum = monthCalc * interestRate,
          monthsInterest = loanAmount + monthSum;
          getSubTabCate = $('.property_tab').children('.select_box').children('div.active').html(),
          getThirdTabCate = $('.trans_tab').children('.select_box').children('div.active').html(),
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
          
          var lowRate = Number($('#interestRate').val()),
              rateNotice = rate;
          if(lowRate < rate) {
            rate = lowRate;
          }

      var brokerage = rate / 100,
          brokerageCalc = loanAmount * brokerage,
          brokerageSum = parseInt(brokerageCalc);
          brokerageSum = brokerageCalc;

      if (getTabCate === "전세자금대출") {
        var numPayments = Number(getSteps[2].value);
  
        if ($(".select_one").hasClass("active")) {
          if($('.year').hasClass('active')) interestRate = interestRate * 12;
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
              html = '';

          html =
            '<div>\
              <div>1</div>\
              <div>'+emi.toLocaleString('ko-KR')+'</div>\
              <div>'+equalSum.toLocaleString('ko-KR')+'</div>\
             </div>';

          $('.monthly_list').html(html);

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
          $('.monthly_list').html(html);
          $('.momthly_notice').html('(원리금균등)');

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
        else if ($(".select_two").hasClass("active")) {
          if($('.year').hasClass('active')) interestRate = interestRate * 12;

          var equaLoan = loanAmount / interestRate,
              equalCalc = ((getSteps[2].value / 100) / 12),
              calcEqual = loanAmount * equalCalc,
              equalMonth = equaLoan + calcEqual,
              equalSum = loanAmount - equalMonth + calcEqual,
              totalInterest = 0,
              orgCalcEqual = calcEqual,
              orgEqualMonth = equalMonth,
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

          $('.monthly_list').html(html);

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
        $('.monthly_list').html(html);
        $('.momthly_notice').html('(원금균등)');

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
            if($('.year').hasClass('active')) {
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
            '<div class="notice">월단위로 계산된 이자이기 때문에 일단위로 계산되는 금융기관의 대출이자와는 차이가 있습니다.</div>'
        }
        if (!$(".select_third").hasClass("active")) {
          html += '<div class="space_bar"></div>';
          html +=
            '<div class="sum_info">1회차 상환금액<div>' +
            orgEqualMonth.toLocaleString('ko-KR') +
            " 원</div>\
            </div>\
            <span class='month_btn notice' onclick='showMonthly()'>월별 상환금액 더 보기<img src='img/right_arrow.svg'/></span>\
            <div class='notice'>월단위로 계산된 이자이기 때문에 일단위로 계산되는 금융기관의 대출 이자와는 차이가 있습니다.</div>";
        }
      } else if (getTabCate === "중도상환 수수료") {
        var getLoanVal = Number($('.loan_select').siblings('div').children('input').val()),
            getLoanType = $('.loan_select').children('.active').text(),
            getReminType = $('.remain_select').children('.active').text(),
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
              <div class="rate_title" onclick="showRateChart(this)">중개보수 요율표<small class="rate_type notice">('+$('select').val()+', '+getSubTabCate+', '+getThirdTabCate+')</small>\
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
    $(".sum").html(html);
    if(getSubTabCate === '주택') $('.' + upper).addClass('active');
    
    var id = Math.floor(new Date().getTime() + Math.random());

    newRecord = {};
    newRecord.id = id;
    newRecord.type = getTabCate;
    newRecord.date = getDate;
    newRecord.title = $('.edit_box').val();

    if (getTabCate === "전세자금대출") {
      var getPayType = $('.step_four').children('.select_box').children('.active'),
          getStep = $('.repay_method').children('.active').text(),
          getTerm = $('.change.mark').html(),
          interestRate = Number(getSteps[1].value.replaceAll(',', ''));

      newRecord.info1 = loanAmount.toLocaleString('ko-KR');
      newRecord.info2 = interestRate + ' ' + getTerm;
      newRecord.info3 = numPayments + ' %';
      newRecord.info4 = getPayType.html();
      newRecord.info5 = $('.sum_one').html();
      newRecord.info6 = $('.sum_two').html();
      newRecord.info7 = $('.sum_thirds').html();
      
      if(getStep !== '만기일시') {
        newRecord.info8 = $('.sum_info').children('div').html(); 
      }
    } else if(getTabCate === "부동산 중개보수") {
      newRecord.info1 = getSubTabCate;
      newRecord.info2 = $('select').val() ;
      newRecord.info3 = $('.active')[4].innerHTML;
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
    $(".calc_btn").html("저장하기");
    $(".calc_btn").attr("onclick", "saveRecordList(newRecord)");
  }
}

function showExtra() {
  $(".extra_popup").animate({"left":"0"}, 150);
  showQna("전체");
}

function hideExtra() {
  $(".extra_popup").animate({"left":"100%"}, 150);
}

function showRecordPopup(id) {

  var findRecordDesc = orgRecord.filter((getRecord) => getRecord.id === id),
      record = findRecordDesc[0];

  $(".record_popup").animate({"left":"0"}, 150);

  html =
    '<div class="record_title popup_recordTitle"><small>' +
    record.type +
    '</small><div><input type="text" class="edit_box" id="recordTitle" onpaste="return false;" onfocus="this.blur()" readonly value="' +
    record.title +
    '"onkeydown="checkKey(event)" maxlength="15" oninput="maxLengthChk(this)"><img src="img/edit.svg" class="edit_btn record_edit" onclick="editTitleSave(this, ' +
    id +
    ')"></div></div>';

  if (record.type === "전세자금대출") {
    html +=
      '<div class="record_desc">\
      <div class="calc_type">대출금액<div class="info">' +
      record.info1.toLocaleString('ko-KR') +
      ' 원</div></div>\
      <div class="principal">대출기간<div class="info">' +
      record.info2 +
      '</div></div>\
      <div class="interest">연이자율<div class="info">' +
      record.info3 +
      '</div></div>\
      <div class="Summation">상환방법<div class="info">' +
      record.info4 +
      '</div></div>\
      <div class="border_bar"></div>\
      <div class="calc_type">대출원금<div class="info">' +
      record.info5 +
      '</div></div>\
      <div class="principal">총 대출이자<div class="info">' +
      record.info6 +
      '</div></div>\
      <div class="interest">총 상환금액<div class="info">' +
      record.info7 +
      '</div></div>';
      if(record.info4 !== '만기일시') {
        html +=
        '<div class="border_bar"></div>\
        <div class="sum_info">1회차 상환금액<div>' +
        record.info8 + "</div>";
      }
      html += "</div><div class='notice' style='color: #414141'>월단위로 계산된 이자이기 때문에 일단위로 계산되는 금융기관의 대출 이자와는 차이가 있습니다.</div>";
  } else if (record.type === "부동산 중개보수") {
    html +=
      '<div class="record_desc">\
        <div class="calc_type">매물유형<div>\
        </div><div class="info">' +
        record.info1 +
        '</div></div>';
      if(record.info1 === '주택') {
        html += '<small class="notice">주택의 부속토지 주택분양권 포함</small>';
      } else if(record.info1 === '오피스텔') {
        html += '<small class="notice">부엌화장실등의 시설을 갖춘 전용면적 85㎡ 이하 오피스텔</small>';
      } else {
        html += '<small class="notice">오피스텔(주거용 제외). 상가, 토지 등</small>';
      }
    html +=
      '<div class="principal">거래지역<div class="info">' +
      record.info2 +
      '</div></div>\
        <div class="interest">거래유형<div class="info">' +
      record.info3 +
      '</div></div>';
      if(record.info3 === '전세') {
        html += '<div class="Summation">보증금<div class="info">' +
        record.info4 +
        ' 원</div></div>';
      } else if(record.info3 === '월세') {
        html += '<div class="Summation">보증금<div class="info">' +
        record.info4 +
        ' 원</div></div>';
        html += '<div class="Summation">월세<div class="info">' +
        record.info9 +
        ' 원</div></div>';
      } else {
        html += '<div class="Summation">거래금액<div class="info">' +
        record.info4 +
        ' 원</div></div>';
      }
      html += 
        '<div class="Summation">협의보수율<div class="info">' +
      record.info5 +
      '</div></div>\
        <div class="border_bar"></div>\
        <div class="calc_type">최대 중개보수<div class="info">' +
      record.info6 +
      '</div></div>\
        <div class="principal">협의/상한요율<div class="info">' +
      record.info7 +
      '</div></div>\
        <div class="interest">거래금액<div class="info">' +
      record.info8 +
      " 원</div></div>\
      ";
  } else {
    html +=
      '<div class="record_desc">\
        <div class="calc_type">상환금액<div class="info">' +
      record.info1 +
      '</div></div>\
        <div class="principal">대출기간<div class="info">' +
      record.info2 +
      '</div></div>\
        <div class="interest">잔존기간<div class="info">' +
      record.info3 +
      '</div></div>\
        <div class="Summation">수수료율<div class="info">' +
      record.info4 +
      '</div></div>\
        <div class="border_bar"></div>\
        <div class="calc_type">중도상환 수수료<div class="info">' +
      record.info6 +
      '</div></div>\
        <span class="notice">정확한 수수료율은 대출 계약서를 확인하세요.</span>\
      ';
  }
  html +=
    '<div class="record_delete" style="color: #000">\
    <div class="record_date popup_date" onclick="showRecordPopup(' +
    record.id +
    ')">' +
    record.date +
    '</div>\
  </div></div>';

  $(".popup_desc").html(html);

  var sharebtn = "<div class='share_btns'>\
                    <div class='share_btn' onclick='setTimeout(shareRecord(this))'>URL 복사하기<img src='img/url_icon.svg'></div>\
                    <div class='delete_btn'onclick='deletRecord("+id+")'><img src='img/delte_icon.svg'></div>\
                  </div>";
  $('.record_popup').append(sharebtn); 

  if(record.type === '중도상환 수수료') $('.share_btn, .record_edit, .popup_desc, .edit_btn').addClass('charge');
  else if(record.type === '부동산 중개보수') $('.share_btn, .record_edit, .popup_desc, .edit_btn').addClass('brokerage');
}

function checkKey(event) {
  var getTitle = $(".edit_box").val();

  if (event.keyCode === 13) {
    if (getTitle === "") {
      showToast('제목을 입력해 주세요');
      $(".edit_box").focus();
    } else {
      $(".edit_box").prop("readonly", true);
      $(".edit_box").attr("onfocus", "this.blur()");
      $(".edit_box").blur();
      $(".edit_btn").removeClass("active");

      var findRecordDesc = orgRecord.filter((getRecord) => getRecord.id === id),
          record = findRecordDesc[0];

      record.title = getTitle;
      saveRecord();
      setRecordList();
    }
  }
}

function editTitleSave(e, id) {
  var getTitle = $(".edit_box").val();

  $(e).toggleClass("active");

  if ($(e).hasClass("active")) {
    $('#recordTitle').prop("readonly", false);
    $('#recordTitle').attr("onfocus", true);
    $('#recordTitle').focus();
    setInputCursorPositonToLast($("#recordTitle"));
  } else {
    if (getTitle === "") {
      showToast('제목을 입력해 주세요');
      
      $('#recordTitle').attr("onfocus", true);
      $('#recordTitle').focus();
      $(".edit_btn").addClass("active");
      return;
    } else {
      $('#recordTitle').prop("readonly", true);
      $('#recordTitle').blur();
      $(".record_cons").html("");
      $(".edit_btn").removeClass("active");

      var findRecordDesc = orgRecord.filter((getRecord) => getRecord.id === id),
          record = findRecordDesc[0];

      record.title = getTitle;
      saveRecord();
      setRecordList();
    }
  }
}

function editTitle(e) {
  var getTitle = $(".edit_box").val();

  $(e).toggleClass("active");

  if ($(e).hasClass("active")) {
    $('#popupTitle').prop("readonly", false);
    $('#popupTitle').attr("onfocus", true);
    $('#popupTitle').focus();
    $(".edit_btn").addClass("active");
    setInputCursorPositonToLast($("#popupTitle"));
  } else {
    if (getTitle === "") {
      showToast('제목을 입력해 주세요');
      $(".edit_box").focus();
    } else {
      $('#popupTitle').prop("readonly", true);
      $('#popupTitle').attr("onfocus", "this.blur()");
      $('#popupTitle').blur();
      $(".edit_btn").removeClass("active");
    }
  }
}

function showQna(e) {
  var html = "",
    tabTitle = $(e).html();

  $(e).addClass("active");
  $(e).siblings().removeClass("active");

  if (tabTitle === "전체" || e === "전체") {
    html +=
      '<div class="q_box" onclick="toggleQna(this)">\
      <div class="q">원리금균등 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>원리금균등상환은 매월 동일한 원금과 이자를 상환하는 방식입니다. 즉 1천만원을 3%의 금리로 12개월간 대출 시 매월 846,936원의 일정한 금액을 상환하기 때문에 재정계획 설립하기에 용이합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">원리금균등 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>월마다 내야할 금액(월불입금)의 계산식은 다음과 같습니다.</br>\
      원금*이자율/12*(1+이자율/12)^기간/((1+이자율/12)^기간-1)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">원금균등 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>원금균등상환은 매월 동일한 원금과 남은 잔금에 상응하는 이자를 매월 상환하는 방식입니다. 즉 1천만원 12개월간 대출하신 경우 매월 833,333원의 원금을 상환하며 잔금에 3%의 금리를 적용하여 산출한 이자를 함께 지불합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">원금균등 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>월마다 내야하는 월불입금(원리금)의 계산방법은 아래와 같습니다.</br>\
      월불입금 = {원금 / 기간(월)} + {대출잔액 X 이자율 X 12}</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">만기일시 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>만기일시 상환은 대출을 받은 뒤, 만기일까지 매월 이자만 상환 하다가 만기에 대출 원금 전액을 한꺼번에 갚은 방식입니다. 초기에는 원금을 갚지 않아도 되기 때문에 부담이 적지만 만기 때 목돈이 필요하며, 세 가지 상환 방식 중 총 이자 부담액이 가장 큰 단점이 있습니다.\
      </div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">만기일시 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>만기일시에 상환하는 만기일시의 계산방법은 아래와 같습니다.</br>\
      대출원금 * ( 연 이자율/12 ) * (대출기간(년) * 12)\
      </div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">부동산 중개보수가 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>부동산 중개보수란? 부동산중개사가 중개를 한 대가로 받는 보수를 말하며, 보수의 지불시기는 다른 약정이 없는 한 거래대금을 완불할 때 다음의 요율 및 한도액의 범위내에서 거래당사자가 각각 부담합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">주택 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.6%	250,000원</br>\
      5천만원 이상~2억원 미만	0.5%	800,000원</br>\
      2억원 이상~9억원 미만	0.4%	-</br>\
      9억원 이상~12억원 미만	0.5%	-</br>\
      12억원 이상~15억원 미만	0.6%	-</br>\
      15억원 이상	0.7%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">오피스텔 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.5%	200,000원</br>\
      5천만원 이상~1억원 미만	0.4%	300,000원</br>\
      1억원 이상~6억원 미만	0.3%	-</br>\
      6억원 이상~12억원 미만	0.4%	-</br>\
      12억원 이상~15억원 미만	0.5%	-</br>\
      15억원 이상	0.6%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">주택 외 부동산 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.5%	200,000원</br>\
      5천만원 이상~1억원 미만	0.4%	300,000원</br>\
      1억원 이상~6억원 미만	0.3%	-</br>\
      6억원 이상~12억원 미만	0.4%	-</br>\
      12억원 이상~15억원 미만	0.5%	-</br>\
      15억원 이상	0.6%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">중개보수 비용은 언제 지급하나요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>개업공인중개사와 중개의뢰인간 약정에 따르되 약정이 없으면 잔금시 지급합니다(공인중개사법 시행령 27조의2)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">중개보수도 현금영수증 발급이 되나요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>중개수수료는 세법에 의거 의무적으로 현금영수증을 발행해야 합니다</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">중도상환 수수료가 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>은행이 채무자로부터 >중도상환 수수료를 받는 것은, 당초 약정기간동안 대출금을 운용하여 얻을 수 있는 수익을 채무자가 기한전에 미리 갚음으로 인해 얻지 못하게 되는 것에 대한 보전 성격이 있는 수수료입니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">중도상환 수수료를 내야하는 이유가 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>중도상환 수수료는 자금운용의 기회비용을 최소화하기 위하여 부과되는 비용입니다.\
      즉, 만기에 상환될 것이라고 예상하였던 대출금이 중도상환될 경우 은행입장에서는 향후 이자수입을 잃게 되거나 상환받은 자금을 더 낮은 이율로 운용해야하므로 통상적으로 대출계약시 중도상환 위약금에 관한 규정을 두고 있습니다.\
      참고로 구체적인 수수료 금액은 상환금액, 상환기간 등에 따라 은행이 자율적으로 정하고 있습니다.\
      </div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">중도상환 수수료 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>중도상환 계산 방법은 아래 식으로 계산할 수 있습니다.\
      >중도상환 수수료 = 중도상환액 x 수수료율 x (잔존기간 / 전체 대출기간)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">중도상환 수수료 면제기간이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>일부 대출은 일정 기간이 지나면 >중도상환 수수료를 면제해주기도 합니다.</br>\
      면제기간이 있는 경우 >중도상환 수수료 계산 방법은 아래와 같습니다.</br>\
      >중도상환 수수료 = 중도상환액 x 수수료율 x (면제기간까지 남은 기간 / 면제기간)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">중도상환 수수료 면제기간이 궁금해요!<img src="img/open.svg"></div>\
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
      <div class="q">중도상환 수수료 잔존기간이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>잔존기간은 대출 계약서 작성 시 약정했던 전체 대출기간에서 남은 기간을 의미합니다.\
      예를 들어 전체 대출 기간이 10년이고 현재 2년이 지났다면 잔존기간은 8년입니다.</div></div></div>\
     </div>';
  } else if (tabTitle === "전세자금대출") {
    html +=
      '<div class="q_box" onclick="toggleQna(this)">\
      <div class="q">원리금균등 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>원리금균등상환은 매월 동일한 원금과 이자를 상환하는 방식입니다. 즉 1천만원을 3%의 금리로 12개월간 대출 시 매월 846,936원의 일정한 금액을 상환하기 때문에 재정계획 설립하기에 용이합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">원리금균등 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>월마다 내야할 금액(월불입금)의 계산식은 다음과 같습니다.</br>\
      원금*이자율/12*(1+이자율/12)^기간/((1+이자율/12)^기간-1)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">원금균등 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>원금균등상환은 매월 동일한 원금과 남은 잔금에 상응하는 이자를 매월 상환하는 방식입니다. 즉 1천만원 12개월간 대출하신 경우 매월 833,333원의 원금을 상환하며 잔금에 3%의 금리를 적용하여 산출한 이자를 함께 지불합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">원금균등 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>월마다 내야하는 월불입금(원리금)의 계산방법은 아래와 같습니다.</br>\
      월불입금 = {원금 / 기간(월)} + {대출잔액 X 이자율 X 12}</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">만기일시 상환이 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>만기일시 상환은 대출을 받은 뒤, 만기일까지 매월 이자만 상환 하다가 만기에 대출 원금 전액을 한꺼번에 갚은 방식입니다. 초기에는 원금을 갚지 않아도 되기 때문에 부담이 적지만 만기 때 목돈이 필요하며, 세 가지 상환 방식 중 총 이자 부담액이 가장 큰 단점이 있습니다.\
      </div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">만기일시 상환 계산법은 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>만기일시에 상환하는 만기일시의 계산방법은 아래와 같습니다.</br>\
      대출원금 * ( 연 이자율/12 ) * (대출기간(년) * 12)\
      </div></div></div>\
     </div>';
  } else if (tabTitle === "부동산 중개보수") {
    html +=
      '<div class="q_box" onclick="toggleQna(this)">\
      <div class="q">부동산 중개보수가 뭔가요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>부동산 중개보수란? 부동산중개사가 중개를 한 대가로 받는 보수를 말하며, 보수의 지불시기는 다른 약정이 없는 한 거래대금을 완불할 때 다음의 요율 및 한도액의 범위내에서 거래당사자가 각각 부담합니다.</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">주택 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.6%	250,000원</br>\
      5천만원 이상~2억원 미만	0.5%	800,000원</br>\
      2억원 이상~9억원 미만	0.4%	-</br>\
      9억원 이상~12억원 미만	0.5%	-</br>\
      12억원 이상~15억원 미만	0.6%	-</br>\
      15억원 이상	0.7%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">오피스텔 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.5%	200,000원</br>\
      5천만원 이상~1억원 미만	0.4%	300,000원</br>\
      1억원 이상~6억원 미만	0.3%	-</br>\
      6억원 이상~12억원 미만	0.4%	-</br>\
      12억원 이상~15억원 미만	0.5%	-</br>\
      15억원 이상	0.6%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">주택 외 부동산 중개보수 요율이 궁금해요!<img src="img/open.svg"></div>\
      <div class="a"><div><div>거래금액	상한요율	한도액</br>\
      5천만원 미만	0.5%	200,000원</br>\
      5천만원 이상~1억원 미만	0.4%	300,000원</br>\
      1억원 이상~6억원 미만	0.3%	-</br>\
      6억원 이상~12억원 미만	0.4%	-</br>\
      12억원 이상~15억원 미만	0.5%	-</br>\
      15억원 이상	0.6%	-</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">중개보수 비용은 언제 지급하나요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>개업공인중개사와 중개의뢰인간 약정에 따르되 약정이 없으면 잔금시 지급합니다(공인중개사법 시행령 27조의2)</div></div></div>\
     </div>\
     <div class="q_box" onclick="toggleQna(this)">\
      <div class="q">중개보수도 현금영수증 발급이 되나요?<img src="img/open.svg"></div>\
      <div class="a"><div><div>중개수수료는 세법에 의거 의무적으로 현금영수증을 발행해야 합니다</div></div></div>\
     </div>';
  } else {
    html +=
   '<div class="q_box" onclick="toggleQna(this)">\
    <div class="q">중도상환 수수료가 뭔가요?<img src="img/open.svg"></div>\
    <div class="a"><div><div>은행이 채무자로부터 >중도상환 수수료를 받는 것은, 당초 약정기간동안 대출금을 운용하여 얻을 수 있는 수익을 채무자가 기한전에 미리 갚음으로 인해 얻지 못하게 되는 것에 대한 보전 성격이 있는 수수료입니다.</div></div></div>\
   </div>\
   <div class="q_box" onclick="toggleQna(this)">\
    <div class="q">중도상환 수수료를 내야하는 이유가 뭔가요?<img src="img/open.svg"></div>\
    <div class="a"><div><div>중도상환 수수료는 자금운용의 기회비용을 최소화하기 위하여 부과되는 비용입니다.\
    즉, 만기에 상환될 것이라고 예상하였던 대출금이 중도상환될 경우 은행입장에서는 향후 이자수입을 잃게 되거나 상환받은 자금을 더 낮은 이율로 운용해야하므로 통상적으로 대출계약시 중도상환 위약금에 관한 규정을 두고 있습니다.\
    참고로 구체적인 수수료 금액은 상환금액, 상환기간 등에 따라 은행이 자율적으로 정하고 있습니다.\
    </div></div></div>\
   </div>\
   <div class="q_box" onclick="toggleQna(this)">\
    <div class="q">중도상환 수수료 계산법은 뭔가요?<img src="img/open.svg"></div>\
    <div class="a"><div><div>중도상환 계산 방법은 아래 식으로 계산할 수 있습니다.\
    >중도상환 수수료 = 중도상환액 x 수수료율 x (잔존기간 / 전체 대출기간)</div></div></div>\
   </div>\
   <div class="q_box" onclick="toggleQna(this)">\
    <div class="q">중도상환 수수료 면제기간이 궁금해요!<img src="img/open.svg"></div>\
    <div class="a"><div><div>일부 대출은 일정 기간이 지나면 >중도상환 수수료를 면제해주기도 합니다.</br>\
    면제기간이 있는 경우 >중도상환 수수료 계산 방법은 아래와 같습니다.</br>\
    >중도상환 수수료 = 중도상환액 x 수수료율 x (면제기간까지 남은 기간 / 면제기간)</div></div></div>\
   </div>\
   <div class="q_box" onclick="toggleQna(this)">\
    <div class="q">중도상환 수수료 면제기간이 궁금해요!<img src="img/open.svg"></div>\
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
    <div class="q">중도상환 수수료 잔존기간이 궁금해요!<img src="img/open.svg"></div>\
    <div class="a"><div><div>잔존기간은 대출 계약서 작성 시 약정했던 전체 대출기간에서 남은 기간을 의미합니다.\
    예를 들어 전체 대출 기간이 10년이고 현재 2년이 지났다면 잔존기간은 8년입니다.</div></div></div>\
   </div>';
  }
  $(".extra_desc").html(html);
}

function shareRecord(e){
  $('.share_btns').addClass('active');
  $(e).attr('onclick', '');

  html2canvas($('.popup_main')[0], {useCORS:true, allowTaint: true, foreignObjectRendering: true, proxy: this._proxyURL, scrollX: window.pageXOffset, scrollY: window.pageYOffset, x: window.pageXOffset, y: window.pageYOffset, width: window.innerWidth}).then(function(canvas){
    canvas.style.positon = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';

    var imgData = canvas.toDataURL();

    var sendData = new FormData();
        sendData.append('data', imgData);
    
    $.ajax({
      cache : false,
      url : 'http://dev.nuribom.com:10000/pproject/cal/api/upload',
      processData : false,
      contentType : false,
      crossDomain : true,
      xhrFields: { withCredentials:false },
      type : 'POST',
      data : sendData,
      success : function(resource){
          var url = resource.url;
          navigator.clipboard.writeText(url).then(function() {
          }, function() {
            clip(url);
          });
        $(e).attr('onclick', 'setTimeout(shareRecord(this))');
        $('.share_btns').removeClass('active');
        showToast('URL이 복사되었습니다');
      }, error : function(xhr,status,erorr){
        showToast('URL 복사에 실패하였습니다');
        $(e).attr('onclick', 'setTimeout(shareRecord(this))');
        $('.share_btns').removeClass('active');
      }
    });
  });
}

function clip(url){
	var t = document.createElement("textarea");
	document.body.appendChild(t);
	t.value = url;
	t.select();
	document.execCommand('copy');
	document.body.removeChild(t);
}


function downloadUri(uri, name){
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
}

function checkFocus() {
  $(".sum").hide();
  $(".reset_btn").removeClass("center");
  $(".calc_btn").show();
  $(".calc_btn").html("계산하기");
  $(".calc_btn").removeClass("active");
  $(".calc_btn").attr("onclick", "calculating()");
}

function addQuote(e){
  var getVal = $(e).val(),
      getNum = Number(getVal.replaceAll(/,/g, '')),
      quoteNum = getNum.toLocaleString('ko-KR');

  $(e).val(quoteNum);
}

function setInputCursorPositonToLast(element) {
  setTimeout(function () {
    var inputValLength = element.val().length;
    element[0].setSelectionRange(inputValLength, inputValLength);
  }, 0);
}

function toggleQna(e) {
  $(e).toggleClass("active");
  if ($(e).hasClass("active")) {
    $(e).siblings().removeClass("active");
    $(e).siblings().find(".a").slideUp();
    $(e).siblings().find(".q").find('img').attr('src' , 'img/open.svg');
    $(e).find(".a").stop().slideDown();
    $(e).find(".q").find('img').attr('src' , 'img/close.svg');
  } else {
    $(e).find(".a").stop().slideUp();
    $(e).find(".q").find('img').attr('src' , 'img/open.svg');
  }
}

function maxLengthChk(e){
  var obj = $(e),
      maxLength = 15;
  
	if (obj.val().length > maxLength)
    obj.val(obj.val().substring(0, maxLength))
}

function sortList(e) {  
  $(e).toggleClass('active');
  if($(e).hasClass('active')) {
    $('.record_cons').addClass('active');
    $('.sort_list').find('div').html('최신순');
    newest = true;
  } else {
    $('.record_cons').removeClass('active');
    $('.sort_list').find('div').html('과거순');
    newest = false;
  }
  $('.record_list').scrollTop(0);
  localStorage.setItem("newest", JSON.stringify(newest));
}

function hideRecordPopup() {
  $(".record_popup").animate({"left":"100%"}, 150);
  $('.share_btn, .record_edit, .popup_desc, .edit_btn').removeClass('charge brokerage');
  $('.share_btns').remove();
}

function showCalc() {
  $(".calc").animate({"left":"0"}, 150);
  $('.record_edit').remove();
  $('.calc_tab').children('div:first-child').addClass('active');
  $('.calc_tab').children('div:first-child').siblings().removeClass('active');
  $('.edit_box').val('계산기');
  setCharterHtml();
}

function hideCalc() {
  $(".calc").animate({"left":"100%"}, 150);
  $(".calc_btn").html("계산하기");
  $(".calc_btn").attr("onclick", "calculating()");
  $('.edit_btn').removeClass('active');
  $(".edit_box").prop("readonly", true);
  $(".edit_box").attr("onfocus", "this.blur()");
}

function showRateChart(e) {

  $(e).toggleClass('active');

  if($(e).hasClass('active')) {
    $('.rate_box').stop().slideDown();
  } else {
    $('.rate_box').stop().slideUp();
  }
}

function showMenu() {
  $(".menu_popup").animate({"left":"0"}, 200);
}

function hideMenu() {
  $(".menu_popup").animate({"left":"100%"}, 200);
}

function showOss() {
  $(".oss_popup").animate({"left":"0"}, 200);
}

function hideOss() {
  $(".oss_popup").animate({"left":"100%"}, 200);
}

function showMonthly() {
  $(".monthly_table").animate({"left":"0"}, 200);
  $('.monthly_list').scrollTop(0);
}

function hideMonthly() {
  $(".monthly_table").animate({"left":"100%"}, 200);
}

function closeAdd() {
  $('.add').fadeOut();
}

function showAd(){
  $('.add').fadeOut();
  window.open("http://www.nuribom.com/default/", "", "");  
}

function showToast(title){
  var toast = '<div class="toast">'+title+'</div>';
  $('body').append(toast);

  $(".toast").fadeIn();
  setTimeout(function(){
      $(".toast").fadeOut(function(){
        $(".toast").remove();
      });
  }, 1000);
}
