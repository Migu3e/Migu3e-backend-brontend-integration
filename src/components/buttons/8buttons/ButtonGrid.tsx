import Button from './AllButton.tsx';

const ControlPanel =  () => (
    <div className="bg-[#282828] pt-4 pb-2 inline-block rounded-md">
        <div className="grid grid-cols-4 gap-2 mb-2">
            <Button label="LITE" />
            <Button label="FREQ" />
            <Button label="TEST" />
            <Button label="FNC" subLabel="RST" className=" flex flex-col justify-between p-2" />
            <Button label="CLR" className=" absolute text-xs">
                <span className="bottom-1">▼</span>
            </Button>
            <Button label="SEC" className=" absolute text-xs">
                <span className="top-1">▲</span>
            </Button>
            <Button label="AJ" className=" absolute text-xs">
                <span className="right-2">►</span>
            </Button>
            <Button label="ENT" />
        </div>
        <div className="relative mt-1">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-between w-20">
                <div className="bg-white w-8 h-[0.0625rem]"></div>
                <div className="bg-white w-8 h-[0.0625rem]"></div>
            </div>
            <div className="text-white text-xs text-center">ERS</div>
        </div>
    </div>
);

export default ControlPanel;
