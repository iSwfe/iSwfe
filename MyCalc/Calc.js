/**
 * 介绍:
 * 		[opt]:功能键,运算符
 * 		[num]:0-9的数字,包括'.'
 * 		[numArr]:只包含 [单运算符opt , 两个运算数(numArr[0]和numArr[1])] 如:['+', 123, 321]
 * 					由getNumArr()得出,该方法只由calc()调用.
 */
var rstBoxID = "rstBox";
var optsRegex = "[\\+\\-\\*\\/]";
var isCalcing = true;	//表示正在运算的指示器
var boxVal = "";
var boxLen = boxVal.length;
var numArr = ["", 0, 0];
//alert("12341234".search("[2\\+\\-\\*\\/]"));

//从UI调用的方法有:inputNum(num) operate(opt)
function inputNum(num)
{
	//如果检测到运算结束(isCalcing指示器关闭),则自动清除[opt:C](此opt会自动开启运算指示器)
	if (! isCalcing)
		optClear();
	addBoxChar( num );
}
function operate(opt)
{
	//获得rstBox的值
	boxVal = getBoxVal();
	boxLen = boxVal.length;

	if (0==boxLen)
		addBoxChar("0");
	switch(opt)
	{
	case 'Del':
		//[String方法]:substring()
		delBoxLast();
		break;
	case '=':
		if ( boxVal.match("\\d") )
			calc();
		break;
	default:
		//如果最后一个是"[+-*/]",则替换成现在的+-*/
		if ( boxVal.charAt(boxLen-1).match(optsRegex) )
			delBoxLast();
		//寻找前面的运算符,有则立即计算
		boxVal = document.getElementById(rstBoxID).value;	//更新下刚才可能删除LastOne的boxValue
		if ( boxVal.substring(1).search(optsRegex) >=0 )	//从[1]开始截到最后,再做[+-*/]的匹配,避免"-321"就满足的情况
			calc();

		//当检测到isCalcing指示器关闭时,将其打开,以便继续运算
		if (! isCalcing)
			isCalcing = true;
		//最后才允许添加运算符
		addBoxChar(opt);
		break;
	}
}

function calc()
{
	//获得rstBox的值
	boxVal = getBoxVal();

	//运算指示器智能控制模块,可根据当前boxVal去决定运算指示器是否应该关闭.
		//大部分运算周期是开启的,只需要考虑关闭的情况
	isCalcing = false;
	
	
	//传给getNumArr()去得到 [单运算符opt 和 两个运算数] 的数组
	numArr = getNumArr(boxVal);

	//根据[0]的opt去计算[1]和[2]的结果
	switch( numArr[0] )
	{
	//set到rstBox中
		case "+":
			setBox( Number(numArr[1]) + Number(numArr[2]) );
			break;
		case "-":
			setBox( Number(numArr[1]) - Number(numArr[2]) );
			break;
		case "*":
			setBox( Number(numArr[1]) * Number(numArr[2]) );
			break;
		case "/":
			setBox( Number(numArr[1]) / Number(numArr[2]) );
			break;
		default:
			alert("没有进行运算,请检查您的输入!");
			return;
	}
}

function getNumArr(orgBoxStr)	//originalBoxString:原始的Box框字符串
{
	var newBoxStr = orgBoxStr;
	var num1Char = "";
	var num1 = "";
	var num2Char = "";
	var num2 = "";
	//把num1的'-'提取出来
	if ( 0==orgBoxStr.indexOf('-') )
	{
		num1Char = "-";
		newBoxStr = orgBoxStr.substring(1);
	}//得到( (+)num1 )的newBoxStr
	else if ( -1!=newBoxStr.lastIndexOf("-") && newBoxStr.search(optsRegex)!=newBoxStr.lastIndexOf("-") )
	{
		num2Char = "-";
		var temp1 = newBoxStr.substring(0, newBoxStr.lastIndexOf('-') );//截到last'-'处(不包括'-')
		var temp2 = newBoxStr.substring( newBoxStr.lastIndexOf('-')+1 );//从'-'开始截到最后(不包括'-')
		newBoxStr = temp1 + temp2;//两个temp拼接成(+)num1 [opt] (+)num2
	}//得到( (+)num1和(+)num2 )的newBoxStr

	var optIndex = newBoxStr.search(optsRegex);
	num1 = num1Char + newBoxStr.substring(0, optIndex);//截到[+-*/]处(不包括)
	num2 = num2Char + newBoxStr.substring(optIndex+1);//从[+-*/]开始截到最后(不包括)
//	alert(num1 +","+ num2);
	return [newBoxStr.charAt(optIndex),num1,num2];
}

function setBox(rst)
{//重新设置Box的新值
	document.getElementById(rstBoxID).value = rst;
	
//	rst = String(rst);
//	//缓慢打出结果:
//	for(var i=0; i<rst.length; i++)
//	{
//		alert(i);
//		document.getElementById(rstBoxID).value = rst.substr(0, i+1);
//		sleep(100);
//	}
}

function getBoxVal()
{
	rstBoxID = "rstBox";
	return document.getElementById(rstBoxID).value;
}

function addBoxChar(str)
{//追加一个或多个字符
	document.getElementById(rstBoxID).value += str;
}

function delBoxLast()
{
	boxVal = getBoxVal();
	setBox( boxVal.substring(0, boxVal.length-1) );
}

function optClear()
{//功能键:[opt:C]
	//默认执行:
	document.getElementById(rstBoxID).value = "";
	isCalcing = true;
	//输入框内容清空时才执行,实现二级清除
	if ( 0 == getBoxVal().length )
	{
		rstBoxID = "rstBox";
		optsRegex = "[\\+\\-\\*\\/]";
		boxVal = "";
		boxLen = boxVal.length;
		numArr = ["", 0, 0];
	}
}