import os
import glob
import re

files = glob.glob('NewArch/GTA_Phase3_*.docx')
# Actually, the user says "review documetns in that directory". The directory is `NewArch`.
# Let's extract text using python docx or simply read the text files.
