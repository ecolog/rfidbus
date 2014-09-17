function RfidTransponder() {};

RfidTransponder.GetTransponderBlockSize = function(type)
{
	switch (type) {
		case RfidTransponderType.EpcClass0Gen1:
		case RfidTransponderType.EpcClass1Gen1:
		case RfidTransponderType.EpcClass1Gen2:
			return 2;
	}
	return 0;
}

function RfidTransponderType() {};

RfidTransponderType.EpcClass1Gen2 = 19;
RfidTransponderType.EpcClass0Gen1 = 20;
RfidTransponderType.EpcClass1Gen1 = 21;

function RfidTransponderBank() {};

RfidTransponderBank.Reserved = 0;
RfidTransponderBank.Epc = 1;
RfidTransponderBank.Tid = 2;
RfidTransponderBank.UserMemory = 3;

RfidTransponderBank.EpcDataOffset = 2; // 0 — CRC. 1 — technical info.


function EpcBinaryHeader() {};

EpcBinaryHeader.Sgtin96 = 0x30;

