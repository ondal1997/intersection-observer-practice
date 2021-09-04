import { useEffect, useRef } from 'react';

// TODO : 성능 개선하기
// TODO : 옵저버 비동기 콜백호출 예상동작 보장하기
export default function Trigger({ onIntersect }) {
  const triggerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) onIntersect();
      });
    });

    observer.observe(triggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect]);

  return <div ref={triggerRef}>Trigger</div>;
}
