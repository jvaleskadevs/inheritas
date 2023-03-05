import { useState } from 'react';
import { Utils } from 'alchemy-sdk';
import { FormField, Loader } from '../components';



const History = ({ address, logs, isLoading }) => {

	const [displayLogs, setDisplayLogs] = useState(logs);
	
	const handleSelectChange = (e) => {
		let filterLogsBy = [];
		switch (e.target.value) {
			case "1": 
				filterLogsBy = []; 
				break;
			case "2": 
				filterLogsBy = ['NewAsset']; 
				break;
			case "3": 
				filterLogsBy = ['DiamondPassSold', 'DiamondPassRevoked']; 
				break;
			case "4": 
				filterLogsBy = ['Alive']; 
				break;
			case "5": 
				filterLogsBy = ['Claimed']; 
				break;
			default: filterLogsBy = [];
		}
		console.log(e.target.value);
		console.log(filterLogsBy);
		if (filterLogsBy.length > 0) {
			setDisplayLogs(logs.filter((log) => filterLogsBy.includes(log.name)));
			
		} else {
			console.log(filterLogsBy);
			setDisplayLogs(logs);
		}
	};
	
	return (
		<div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
			{isLoading && <Loader />}
			
			<div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
				<h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Inheritas Assets History</h1>
			</div>			
			
				{ !logs && <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">No historical data found. Try refreshing the site. Connecting another wallet or press the Register Asset button to register your first asset into the Inheritas service.</p> 
				}
				
				{ logs && (
					<div className="flex justify-end w-full mt-[65px] mb-3">
					  <div className="w-[10%]">
						<select
							className="rounded bg-[#3a3a43] font-epilogue font-semibold text-[14px] leading-[24px] py-1 pl-2 text-[#999999]"
							onChange={(e) => handleSelectChange(e)}
						>
						  <option value="1">All</option>
						  <option value="2">New Asset</option>
						  <option value="3">Diamond Pass</option>
						  <option value="4">Update</option>
						  <option value="5">Claim</option>
						</select>
						
					  </div>
					</div>
				)}
					
				{ displayLogs && displayLogs.map((log, i) => 
					log.args && (
						<div key={i} className="w-full flex flex-col gap-[20px] border-[1px] rounded-[10px] py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] shadow-lg mb-[65px]">
							
							<FormField
								labelName=""
								inputType="text"
								value={log.name}
								readOnly
							/>
							
							<div className="flex flex-row">
							
								{ log.args.assetID && (
									<FormField
										labelName="Asset ID"
										inputType="text"
										value={Utils.hexValue(log.args.assetID)}
										readOnly
										light
									/>
								)}

								{ log.args.deadline && (
									<FormField
										labelName="Claimable after"
										inputType="text"
										value={new Date(log.args.deadline * 1000).toISOString().slice(0,10)}
										readOnly
										light
									/>
								)}
							
							</div>
							
							<div className="flex flex-row">
							
								{ log.args.contractAddress && (
									<FormField
										labelName="Contract Address"
										inputType="text"
										value={log.args.contractAddress}
										readOnly
										light
									/>
								)}

								{ log.args.tokenID && (
									<FormField
										labelName="Token ID"
										inputType="text"
										value={log.args.tokenID}
										readOnly
										light
									/>
								)}
							
							</div>
							
							<div className="flex flex-row">
							
								{ (log.args.owner || log.args.from) && (
									<FormField
										labelName="Registrant"
										inputType="text"
										value={
										[log.args.owner, log.args.from].includes(address) ? 'You' : log.args.owner || log.args.from
										}
										readOnly
										light
									/>
								)}
								
								{ (log.args.beneficiary || log.args.to) && (
									<FormField
										labelName="Beneficiary"
										inputType="text"
										value={
										[log.args.beneficiary, log.args.to].includes(address) ? 'You' : log.args.beneficiary || log.args.to
										}
										readOnly
										light
									/>
								)}
							
							</div>
						</div>
					))
				}
		</div>		
	);
}

export default History;
