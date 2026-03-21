import { Outlet } from 'react-router-dom';
import BackgroundCanvas from './BackgroundCanvas';
import CustomCursor from './CustomCursor';

const Layout = () => {
    return (
        <>
            <BackgroundCanvas intensity={0.5} />
            <CustomCursor />
            <div style={{ position: 'relative', zIndex: 2 }}>
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
