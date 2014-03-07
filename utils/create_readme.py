#!/usr/bin/env python
#-*- coding: utf-8 -*-

import os
import re

dir_src = '../src'
raw_script_url = 'https://github.com/heymexa/gw_scripts/raw/master/src/%s'

readme = [
    '# Скрипты для GanjaWars',
    '## Каталог скриптов'
]


def print_catalog():
    scripts = get_scripts()
    catalog = ''
    template = """#### {0}
_{1}_
<br>
Версия: {2}
<br>
Автор: **{3}**
<br>
[Ссылка на скрипт]({4})\n"""
    for script in scripts:
        catalog += template.format(script[0], script[1], script[2], script[3], script[4])
    return catalog


def get_scripts():
    scripts = []
    files = os.listdir(dir_src)
    for filename in files:
        file = open(dir_src + '/' + filename, 'r', -1, 'utf-8')
        name = (re.search('@name\s+(.*?)\n[\s\S]+@description\s+(.*?)\n[\s\S]+@version\s+(.*?)\n'
                          '[\s\S]+@author\s+(.*?)\n', file.read()))
        if name:
            script = [name.group(1), name.group(2), name.group(3), name.group(4), raw_script_url % filename]
            scripts.append(script)
        else:
            print(filename)
        file.close()
    return scripts


def create_readme():
    print('create README.md')
    file = open('../README.md', 'w', -1, 'utf-8')
    for row in readme:
        file.write(row + '\n')
        if row == '## Каталог скриптов':
            file.write(print_catalog() + '\n')
    file.close()
    print('done')


create_readme()
