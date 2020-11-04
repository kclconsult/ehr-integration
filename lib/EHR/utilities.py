from __future__ import print_function
from builtins import str
from past.builtins import basestring
from builtins import object
import socket, time, uuid

from EHR.APIConstants import APIConstants
from EHR.APIVariables import APIVariables

class Utilities(object):


    @staticmethod
    def ehrRequest(data):

        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        server_address = (APIVariables.ADDRESS, APIVariables.PORT)

        sock.connect(server_address);

        response=""

        try:

            request = '<?xml version="1.0" encoding="utf-8"?>' + \
            '<ClientIntegrationRequest>' + \
            '<RequestUID>' + str(uuid.uuid4()) + '</RequestUID>' + \
            data + \
            '</ClientIntegrationRequest>'

            print(request);
            sock.sendall(request.encode('utf-8'))

            sock.settimeout(20);

            time.sleep(2)

            BUFF_SIZE = 4096

            response = ""

            while True:

                part = sock.recv(BUFF_SIZE)

                response += part

                if len(part) < BUFF_SIZE:
                    break

            try:

                formatted = xml.dom.minidom.parseString(response)

                pretty_xml_as_string = formatted.toprettyxml()

                return pretty_xml_as_string

            except xml.parsers.expat.ExpatError:

                return "Cannot parse response. Is the EHR running?"

        finally:

            sock.close()
