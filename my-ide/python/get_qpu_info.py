import json

vendorList = []
ibmVendor = {"vendorName": "IBM",
             "backends": ["ibmq_20_tokyo", "ibmq_poughkeepsie"]}
vendorList.append(ibmVendor)
dwaveVendor = {"vendorName": "D-Wave",
               "backends": ["DW_2000Q_2_1", "DW_2000Q_VFYC_2_1"]}
vendorList.append(dwaveVendor)
testVendor = {"vendorName": "QuantumZach",
              "backends": ["Best_QPU_Ever"]}
vendorList.append(testVendor)
testVendor2 = {"vendorName": "QuantumZach2",
               "backends": ["Best_QPU_Ever2"]}
vendorList.append(testVendor2)


def get_vendors(*args):
    for arg in args:
        print(json.dumps(arg))


for vendor in vendorList:
    get_vendors(vendor)
