import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
  useEffect,
  useReducer,
} from "react";
import styled from "./index.css";
import mojs from "mo-js";
import userStyle from "./usage.css";

const INITIAL_STATE = {
  count: 0,
  countTotal: 1000,
  isClicked: false,
};

const useClapAnimation = ({ clapEl, countEl, clapTotalEl }) => {
  const [animationTimeLine, setAnimationTimeLine] = useState(
    () => new mojs.Timeline()
  );
  useLayoutEffect(() => {
    if (!clapEl || !countEl || !clapEl) return;
    const tlDuration = 300;
    const scaleButton = new mojs.Html({
      el: clapEl,
      duration: tlDuration,
      scale: { 1.3: 1 },
      easing: mojs.easing.ease.out,
    });

    const countTotalAnimation = new mojs.Html({
      el: clapTotalEl,
      opacity: { 0: 1 },
      delay: (3 * tlDuration) / 2,
      duration: tlDuration,
      y: { 0: -3 },
    });

    const countAnimation = new mojs.Html({
      el: countEl,
      opacity: { 0: 1 },
      duration: tlDuration,
      y: { 0: -30 },
    }).then({ opacity: { 1: 0 }, delay: tlDuration / 2, y: -80 });
    if (typeof clapEl === "string") {
      const clap = document.getElementById("clap");
      clap.style.transform = "scale(1,1)";
    } else {
      clapEl.style.transform = "scale(1,1)";
    }

    const newAnimationTimeLine = animationTimeLine.add([
      scaleButton,
      countTotalAnimation,
      countAnimation,
    ]);
    setAnimationTimeLine(newAnimationTimeLine);
  }, [clapEl, countEl, clapTotalEl]);
  return animationTimeLine;
};
const MAX_USER_CLAP = 40;
const useDOMRef = () => {
  const [DOMRef, setRefState] = useState({});

  const setRef = useCallback((node) => {
    if (!node) return;
    setRefState((prevState) => ({
      ...prevState,
      [node.dataset.refkey]: node, //! for distinction
    }));
  }, []);
  return [DOMRef, setRef];
};

const reducer = ({ count, countTotal }, { type, payload }) => {
  switch (type) {
    case "clap":
      return {
        count: Math.min(count + 1, MAX_USER_CLAP),
        isClicked: true,
        countTotal: count < MAX_USER_CLAP ? countTotal + 1 : countTotal,
      };
    case "reset":
      return payload;
    default:
      break;
  }
  return state;
};

const useClapState = (initialState = INITIAL_STATE) => {
  const userInitialState = useRef(initialState);
  const [clapState, dispatch] = useReducer(reducer, initialState);
  const { count } = clapState;
  const resetRef = useRef(0);
  const updateClapState = useCallback(() => {
    dispatch({ type: "clap" }, []);
  });
  // porps collection it's object at the end ==> turn it to a function!
  const getTogglerProps = ({ ...otherProps }) => ({
    onClick: updateClapState,
    "aria-pressed": clapState.isClicked,
    otherProps: otherProps,
  });

  const getCounterProps = ({ ...otherProps }) => ({
    count: count,
    "aria-valuemax": MAX_USER_CLAP,
    "aria-valuemin": 0,
    "aria-valuemin": count,
    otherProps: otherProps,
  });

  const reset = useCallback(() => {
    dispatch({ type: "reset", payLoad: userInitialState.current });
    // resetRef.current++;
    // setClapState(userInitialState.current);
  }, []);
  return {
    clapState,
    updateClapState,
    getTogglerProps,
    getCounterProps,
    reset,
    resetDep: resetRef,
  };
};

const useEffectAfterMount = (cb, dps) => {
  const compnentJustMounted = useRef(true);
  useEffect(() => {
    if (!compnentJustMounted.current) {
      return cb();
    }
    compnentJustMounted.current = false;
  }, [dps]);
};

const ClapIcon = ({ isClicked }) => {
  return (
    <span>
      {/* SVG */}
      <svg
        data-refkey="clapIconRef"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-549 338 100.1 125"
        className={`${styled.icon} ${isClicked && styled.checked}`}
      >
        <path d="M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z" />
        <path d="M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9" />
      </svg>
    </span>
  );
};

const ClapCount = ({ count, setRef, ...restProps }) => {
  return (
    <span ref={setRef} className={styled.count} {...restProps}>
      +{count}
    </span>
  );
};

const CountTotal = ({ countTotal, setRef, ...restProps }) => {
  return (
    <span ref={setRef} className={styled.total} {...restProps}>
      {countTotal}
    </span>
  );
};

// give all costume hooks
// ui components
const ClapContainer = ({ children, setRef, handleClick, ...resProps }) => {
  return (
    <button
      ref={setRef}
      id="clap"
      className={styled.clap}
      onClick={handleClick}
      {...resProps}
    >
      {children}
    </button>
  );
};

const userInitialState = {
  count: 0,
  countTotal: 0,
  isClicked: false,
};

const Usage = () => {
  const [{ clapRef, clapCountRef, clapTotalRef }, setRef] = useDOMRef();
  const { clapState, getTogglerProps, getCounterProps, reset, resetDep } =
    useClapState(userInitialState);
  const [uploadingReset, setUpload] = useState(false);
  const { count, countTotal, isClicked } = clapState; // destructure the clapstate...
  const animationTimeLine = useClapAnimation({
    clapEl: clapRef,
    countEl: clapCountRef,
    clapTotalEl: clapTotalRef,
  });

  useEffectAfterMount(() => {
    animationTimeLine.replay();
  }, [count]);

  useEffectAfterMount(() => {
    // side effect ...
    setUpload(true);
    console.log("update");
    setTimeout(() => {
      setUpload(false);
    }, 1000);
  }, resetDep);

  return (
    <div>
      <ClapContainer
        setRef={setRef}
        data-refkey="clapRef"
        {...getTogglerProps({ "aria-pressed": "false" })}
      >
        <ClapIcon isClicked={isClicked} />
        <ClapCount
          setRef={setRef}
          data-refkey="clapCountRef"
          {...getCounterProps()}
        />
        <CountTotal
          countTotal={countTotal}
          setRef={setRef}
          data-refkey="clapTotalRef"
        />
      </ClapContainer>
      <section>
        <button onClick={reset} className={userStyle.resetBtn}>
          Reset
        </button>
        <pre className={userStyle.reset}>
          {JSON.stringify({ count, countTotal, resetDep }, null, 2)}
        </pre>
        <pre className={userStyle.reset}>
          {uploadingReset ? `uploading reset ${resetDep}` : "no reset"}
        </pre>
      </section>
    </div>
  );
};

export default Usage;
